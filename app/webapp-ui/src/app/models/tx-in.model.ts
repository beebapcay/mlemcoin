// noinspection DuplicatedCode

import { ObjectUtil } from '../utils/object.util';

export interface ITxIn {
  txOutId: string;
  txOutIndex: number;
  txOutAddress: string;
  signature: string;
}

export class TxIn extends ObjectUtil.autoImplement<ITxIn>() {
  constructor(txInShape: ITxIn) {
    super();
    this.txOutId = txInShape.txOutId;
    this.txOutIndex = txInShape.txOutIndex;
    this.signature = txInShape.signature;
    this.txOutAddress = txInShape.txOutAddress;
  }
}
