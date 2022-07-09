// noinspection DuplicatedCode

import { ObjectUtil } from '../utils/object.util';
import { TxIn } from './tx-in.model';
import { TxOut } from './tx-out.model';

export interface ITransaction {
  id: string;
  txIns: TxIn[];
  txOuts: TxOut[];
}

export class Transaction extends ObjectUtil.autoImplement<ITransaction>() {
  constructor(transactionShape: ITransaction) {
    super();
    this.id = transactionShape.id;
    this.txIns = transactionShape.txIns;
    this.txOuts = transactionShape.txOuts;
  }
}
