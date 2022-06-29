import * as _ from 'lodash';
import { Transaction } from './transaction.model';
import { TxIn } from './tx-in.model';

export class TransactionPool {
  constructor(
    public transactions: Transaction[]
  ) {
  }

  /**
   * @description - Get all tx ins from the transaction pool
   */
  public getTxIns(): TxIn[] {
    return _.flatten(this.transactions.map(tx => tx.txIns));
  }
}

