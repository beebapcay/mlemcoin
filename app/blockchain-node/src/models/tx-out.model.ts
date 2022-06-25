import { UnspentTxOut } from '@models/unspent-tx-out.model';

export class TxOut {
  constructor(
    public readonly address: string,
    public readonly amount: number
  ) {
  }
}

export class TxOutForAmount {
  constructor(
    public readonly includedUnspentTxOuts: UnspentTxOut[],
    public readonly leftOverAmount: number
  ) {
  }
}