import { TransactionPool } from '@node-process/models/transaction-pool.model';
import { Transaction, TransactionUtil } from '@node-process/models/transaction.model';
import { TxInUtil } from '@node-process/models/tx-in.model';
import { ITxOutForAmount, TxOut } from '@node-process/models/tx-out.model';
import { UnspentTxOut, UnspentTxOutUtil } from '@node-process/models/unspent-tx-out.model';
import { EncryptUtil } from '@node-process/utils/encrypt.util';
import { NotEnoughCoinToCreateTransaction } from '@shared/errors';
import { InterfaceUtil } from '@shared/utils/interface.util';
import * as _ from 'lodash';

export interface IWallet {
  address: string;
  balance: number;
  privateKey: string;
  publicKey: string;
}

export class Wallet extends InterfaceUtil.autoImplement<IWallet>() {
  constructor(walletShape: IWallet) {
    super();
  }
}

export class WalletUtil {
  /**
   * @description - Gets the public key from the wallet file
   */
  public static getPublicKey(privateKey: string): string {
    return EncryptUtil.getPublicKey(privateKey);
  }

  /**
   * @description - Generates a private key
   */
  public static generatePrivateKey(): string {
    return EncryptUtil.generatePrivateKey();
  }

  /**
   * @description - Finds the unspent transaction outputs for the transaction amount
   *
   * @param amount
   * @param myUnspentTxOuts
   */
  public static findTxOutsForTransactionAmount(amount: number, myUnspentTxOuts: UnspentTxOut[]): ITxOutForAmount {
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
   * @description - Filters my unspent transaction outputs from the pool
   */
  public static filterTxPoolTxs(myUnspentTxOuts: UnspentTxOut[], transactionPool: TransactionPool): UnspentTxOut[] {
    const txIns = transactionPool.getTxIns();

    const removableTxOuts: UnspentTxOut[] = [];

    for (const unspentTxOut of myUnspentTxOuts) {
      if (!txIns.find(txIn => txIn.txOutId === unspentTxOut.txOutId && txIn.txOutIndex === unspentTxOut.txOutIndex)) {
        continue;
      }

      removableTxOuts.push(unspentTxOut);
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
