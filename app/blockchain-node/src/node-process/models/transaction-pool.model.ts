import { UnspentTxOut } from '@node-process/models/unspent-tx-out.model';
import { ObjectUtil } from '@shared/utils/object.util';
import * as _ from 'lodash';
import { Transaction } from './transaction.model';
import { TxIn } from './tx-in.model';

export interface ITransactionPool {
  transactions: Transaction[];
}

export class TransactionPool extends ObjectUtil.autoImplement<ITransactionPool>() {
  constructor(transactionPoolShape: ITransactionPool) {
    super();
    this.transactions = transactionPoolShape.transactions;
  }

  /**
   * @description - Gets all transaction inputs from the transaction pool
   *
   * @returns TxIn[]
   */
  public getTxIns(): TxIn[] {
    return _.flatten(this.transactions.map(tx => tx.txIns));
  }

  /**
   * @description - Checks if the transaction pool contains references to an unspent transaction output
   *
   * @param unspentTxOut
   */
  public hasReferenceUnspentTxOut(unspentTxOut: UnspentTxOut): boolean {
    return !!this.getTxIns().find(txIn => txIn.txOutId === unspentTxOut.txOutId && txIn.txOutIndex === unspentTxOut.txOutIndex);
  }

  /**
   * @description - Checks if the transaction pool contains duplicate transaction inputs
   *
   * @returns boolean
   */
  public hasDuplicateTxIns(): boolean {
    const txIns = this.getTxIns();
    const uniqueTxIns = _.uniqBy(txIns, txIn => txIn.txOutId + txIn.txOutIndex);
    return txIns.length !== uniqueTxIns.length;
  }
}

