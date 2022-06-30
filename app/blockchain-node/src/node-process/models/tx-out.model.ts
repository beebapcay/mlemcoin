import { InterfaceUtil } from '@shared/utils/interface.util';
import { UnspentTxOut } from './unspent-tx-out.model';

export interface ITxOut {
  address: string;
  amount: number;
}

export class TxOut extends InterfaceUtil.autoImplement<ITxOut>() {
  constructor(txOutShape: ITxOut) {
    super();
  }
}

export interface ITxOutForAmount {
  includedUnspentTxOuts: UnspentTxOut[];
  leftOverAmount: number;
}