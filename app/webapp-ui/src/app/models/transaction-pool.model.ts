// noinspection DuplicatedCode

import { ObjectUtil } from '../utils/object.util';
import { Transaction } from './transaction.model';

export interface ITransactionPool {
  transactions: Transaction[];
}

export class TransactionPool extends ObjectUtil.autoImplement<ITransactionPool>() {
  constructor(transactionPoolShape: ITransactionPool) {
    super();
    this.transactions = transactionPoolShape.transactions;
  }
}

