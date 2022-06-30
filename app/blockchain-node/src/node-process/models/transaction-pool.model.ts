import { InterfaceUtil } from '@shared/utils/interface.util';
import * as _ from 'lodash';
import { Transaction } from './transaction.model';
import { TxIn } from './tx-in.model';

export interface ITransactionPool {
  transactions: Transaction[];
}

export class TransactionPool extends InterfaceUtil.autoImplement<ITransactionPool>() {
  constructor(transactionPoolShape: ITransactionPool) {
    super();
  }

  /**
   * @description - Get all tx ins from the transaction pool
   */
  public getTxIns(): TxIn[] {
    return _.flatten(this.transactions.map(tx => tx.txIns));
  }
}

