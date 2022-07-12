import { TransactionPool } from '@node-process/models/transaction-pool.model';
import { Transaction, TransactionUtil } from '@node-process/models/transaction.model';
import { TxInUtil } from '@node-process/models/tx-in.model';
import { ProcessResultTxOutAmount, TxOut } from '@node-process/models/tx-out.model';
import { UnspentTxOut, UnspentTxOutUtil } from '@node-process/models/unspent-tx-out.model';
import { EncryptUtil } from '@node-process/utils/encrypt.util';
import { NotEnoughCoinToCreateTransaction } from '@shared/errors/not-enough-coin-to-create-transaction.error';
import { ObjectUtil } from '@shared/utils/object.util';
import * as _ from 'lodash';

export interface IWallet {
  address: string;
  privateKey: string;
  publicKey: string;
  balance?: number;
  successTxs?: number;
  pendingTxs?: number;
}

export class Wallet extends ObjectUtil.autoImplement<IWallet>() {
  constructor(walletShape: IWallet) {
    super();
    this.address = walletShape.address;
    this.balance = walletShape.balance;
    this.privateKey = walletShape.privateKey;
    this.publicKey = walletShape.publicKey;
    this.successTxs = walletShape.successTxs;
    this.pendingTxs = walletShape.pendingTxs;
  }
}

export class WalletUtil {
  /**
   * @description - Gets the public key from the wallet file
   *
   * @param privateKey
   *
   * @returns string
   */
  public static getPublicKey(privateKey: string): string {
    return EncryptUtil.getPublicKey(privateKey);
  }

  /**
   * @description - Generates a private key
   *
   * @returns string
   */
  public static generatePrivateKey(): string {
    return EncryptUtil.generatePrivateKey();
  }

  /**
   * @description - Finds the unspent transaction outputs for the transaction amount
   *
   * @param amount
   * @param myUnspentTxOuts
   *
   * @returns {includedUnspentTxOuts: UnspentTxOut[], leftOverAmount: number}
   *
   * @throws NotEnoughCoinToCreateTransaction
   */
  public static findTxOutsForTransactionAmount(amount: number, myUnspentTxOuts: UnspentTxOut[]): ProcessResultTxOutAmount {
    let currentAmount = 0;
    const includedUnspentTxOuts: UnspentTxOut[] = [];

    for (const myUnspentTxOut of myUnspentTxOuts) {
      includedUnspentTxOuts.push(myUnspentTxOut);
      currentAmount += myUnspentTxOut.amount;
      if (currentAmount >= amount) {
        const leftOverAmount = currentAmount - amount;
        return { includedUnspentTxOuts, leftOverAmount };
      }
    }

    throw new NotEnoughCoinToCreateTransaction();
  }

  /**
   * @description - Creates transaction outs from previous amount and left over amount
   *
   * @param receiverAddress
   * @param myAddress
   * @param amount
   * @param leftOverAmount
   *
   * @returns TxOut[]
   */
  public static createTxOuts(receiverAddress: string, myAddress: string, amount: number, leftOverAmount: number): TxOut[] {
    const txOut1 = new TxOut({ address: receiverAddress, amount: amount });
    if (leftOverAmount === 0) {
      return [txOut1];
    } else {
      const txOut2 = new TxOut({ address: myAddress, amount: leftOverAmount });
      return [txOut1, txOut2];
    }
  }

  /**
   * @description - Filters my unspent transaction outputs from the pool.
   * Selects the unspent transaction outputs with not in the pool txIns
   *
   * @param myUnspentTxOuts
   * @param txPool
   *
   * @returns UnspentTxOut[]
   */
  public static filterTxPoolTxs(myUnspentTxOuts: UnspentTxOut[], txPool: TransactionPool): UnspentTxOut[] {
    const removableTxOuts: UnspentTxOut[] = [];

    for (const unspentTxOut of myUnspentTxOuts) {
      if (txPool.hasReferenceUnspentTxOut(unspentTxOut)) {
        removableTxOuts.push(unspentTxOut);
      }
    }

    return _.without(myUnspentTxOuts, ...removableTxOuts);
  }

  /**
   * @description - Creates a transaction from the receiver address and amount
   *
   * @param receiverAddress
   * @param amount
   * @param privateKey
   * @param unspentTxOuts
   * @param txPool
   *
   * @returns Transaction
   *
   * @throws NotEnoughCoinToCreateTransaction
   */
  public static createTransaction(receiverAddress: string, amount: number, privateKey: string,
                                  unspentTxOuts: UnspentTxOut[], txPool: TransactionPool): Transaction {
    const myAddress = EncryptUtil.getPublicKey(privateKey);
    const myUnspentTxOutsA = unspentTxOuts.filter((uTxO) => uTxO.address === myAddress);

    const myUnspentTxOuts = WalletUtil.filterTxPoolTxs(myUnspentTxOutsA, txPool);

    const {
      includedUnspentTxOuts,
      leftOverAmount
    } = WalletUtil.findTxOutsForTransactionAmount(amount, myUnspentTxOuts);

    const unsignedTxIns = includedUnspentTxOuts.map(UnspentTxOutUtil.toUnsignedTxIn);
    const txOuts = WalletUtil.createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);

    const tx = new Transaction({ id: '', txIns: unsignedTxIns, txOuts: txOuts });
    tx.id = TransactionUtil.getTransactionId(tx);

    tx.txIns = tx.txIns.map((txIn, index) => {
      txIn.signature = TxInUtil.signTxIn(tx, index, privateKey, unspentTxOuts);
      return txIn;
    });

    return tx;
  }
}
