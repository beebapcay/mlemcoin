// noinspection DuplicatedCode

import { ObjectUtil } from '../utils/object.util';

export interface IUnspentTxOut {
  txOutId: string;
  txOutIndex: number;
  address: string;
  amount: number;
}

export class UnspentTxOut extends ObjectUtil.autoImplement<IUnspentTxOut>() {
  constructor(unspentTxOutShape: IUnspentTxOut) {
    super();
    this.txOutId = unspentTxOutShape.txOutId;
    this.txOutIndex = unspentTxOutShape.txOutIndex;
    this.address = unspentTxOutShape.address;
    this.amount = unspentTxOutShape.amount;
  }
}
