// noinspection DuplicatedCode

import { ObjectUtil } from '../utils/object.util';

export interface ITxOut {
  address: string;
  amount: number;
}

export class TxOut extends ObjectUtil.autoImplement<ITxOut>() {
  constructor(txOutShape: ITxOut) {
    super();
    this.address = txOutShape.address;
    this.amount = txOutShape.amount;
  }
}
