import { ObjectUtil } from '@shared/utils/object.util';
import { UnspentTxOut } from './unspent-tx-out.model';

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

export interface ProcessResultTxOutAmount {
  includedUnspentTxOuts: UnspentTxOut[];
  leftOverAmount: number;
}