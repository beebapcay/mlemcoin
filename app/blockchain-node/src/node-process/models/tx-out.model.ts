import { UnspentTxOut } from './unspent-tx-out.model';

export class TxOut {
  constructor(
    public readonly address: string,
    public readonly amount: number
  ) {
  }
}

export interface ITxOutForAmount {
  includedUnspentTxOuts: UnspentTxOut[];
  leftOverAmount: number;
}