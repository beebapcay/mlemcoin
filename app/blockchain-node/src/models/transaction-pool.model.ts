import { Transaction } from '@models/transaction.model';
import { TxIn } from '@models/tx-in.model';
import * as _ from 'lodash';

export class TransactionPool {
  constructor(
    public transactions: Transaction[]
  ) {
  }

  /**
   * @description - Get all txIns from the transaction pool
   */
  public getTxIns(): TxIn[] {
    return _.flatten(this.transactions.map(tx => tx.txIns));
  }
}