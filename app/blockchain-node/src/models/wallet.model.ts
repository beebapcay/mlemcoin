import { TransactionPool } from '@models/transaction-pool.model';
import { Transaction, TransactionUtil } from '@models/transaction.model';
import { TxIn, TxInUtil } from '@models/tx-in.model';
import { TxOut, TxOutForAmount } from '@models/tx-out.model';
import { UnspentTxOut } from '@models/unspent-tx-out.model';
import { ConfigurationConstants } from '@shared/constants';
import { NotEnoughCoinToCreateTransaction } from '@shared/errors';
import { EncryptUtil } from '@utils/encrypt.util';
import { readFileSync } from 'fs';
import * as _ from 'lodash';

export class Wallet {
  constructor(
    public address: string,
    public balance: number,
    public privateKey: string,
    public publicKey: string
  ) {
  }
}

export class WalletUtil {
  /**
   * @description - Get the public key from the wallet file
   */
  public static getPublicKey(privateKey: string): string {
    return EncryptUtil.getPublicKey(privateKey);
  }

  /**
   * @description - Generate a private key
   */
  public static generatePrivateKey(): string {
    return EncryptUtil.generatePrivateKey();
  }

  /**
   * @description - Find the unspent transaction outputs for the transaction
   *
   * @param amount
   * @param myUnspentTxOuts
   */
  public static findTxOutsForTransactionAmount(amount: number, myUnspentTxOuts: UnspentTxOut[]): TxOutForAmount {
    let currentAmount = 0;
    const includedUnspentTxOuts: UnspentTxOut[] = [];

    for (const myUnspentTxOut of myUnspentTxOuts) {
      includedUnspentTxOuts.push(myUnspentTxOut);
      currentAmount += myUnspentTxOut.amount;
      if (currentAmount >= amount) {
        const leftOverAmount = currentAmount - amount;
        return {includedUnspentTxOuts, leftOverAmount};
      }
    }

    throw new NotEnoughCoinToCreateTransaction();
  }

  /**
   * @description - Create transaction outs from previous amount and left over amount
   *
   * @param receiverAddress
   * @param myAddress
   * @param amount
   * @param leftOverAmount
   */
  public static createTxOuts(receiverAddress: string, myAddress: string, amount: number, leftOverAmount: number): TxOut[] {
    const txOut1 = new TxOut(receiverAddress, amount);
    if (leftOverAmount === 0) {
      return [txOut1];
    } else {
      const txOut2 = new TxOut(myAddress, leftOverAmount);
      return [txOut1, txOut2];
    }
  }

  /**
   * @description - Filter the unspent transaction outputs from the pool
   */
  public static filterTxPoolTxs(unspentTxOuts: UnspentTxOut[], transactionPool: TransactionPool): UnspentTxOut[] {
    const txIns = _.flatten(transactionPool.transactions.map(tx => tx.txIns));

    const removableTxOuts: UnspentTxOut[] = [];

    for (const unspentTxOut of unspentTxOuts) {
      if (!txIns.find(txIn => txIn.txOutId === unspentTxOut.txOutId && txIn.txOutIndex === unspentTxOut.txOutIndex)) {
        continue;
      }

      removableTxOuts.push(unspentTxOut);
    }

    return _.without(unspentTxOuts, ...removableTxOuts);
  }


  public static createTransaction(receiverAddress: string, amount: number, privateKey: string,
                                  unspentTxOuts: UnspentTxOut[], txPool: TransactionPool): Transaction {
    const myAddress = EncryptUtil.getPublicKey(privateKey);
    const myUnspentTxOutsA = unspentTxOuts.filter((uTxO) => uTxO.address === myAddress);

    const myUnspentTxOuts = WalletUtil.filterTxPoolTxs(myUnspentTxOutsA, txPool);

    const {includedUnspentTxOuts, leftOverAmount} = WalletUtil.findTxOutsForTransactionAmount(amount, myUnspentTxOuts);

    const toUnsignedTxIn = (unspentTxOut: UnspentTxOut) => {
      return new TxIn(unspentTxOut.txOutId, unspentTxOut.txOutIndex, '');
    }

    const unsignedTxIns = includedUnspentTxOuts.map(toUnsignedTxIn);
    const txOuts = WalletUtil.createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);

    const tx = new Transaction('', unsignedTxIns, txOuts);
    tx.id = TransactionUtil.getTransactionId(tx);

    tx.txIns = tx.txIns.map((txIn, index) => {
      txIn.signature = TxInUtil.signTxIn(tx, index, privateKey, unspentTxOuts);
      return txIn;
    });

    return tx;
  }
}
