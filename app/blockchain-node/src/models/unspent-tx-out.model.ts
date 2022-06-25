import { TxIn } from '@models/tx-in.model';

export class UnspentTxOut {
  constructor(
    public readonly txOutId: string,
    public readonly txOutIndex: number,
    public readonly address: string,
    public readonly amount: number
  ) {
  }
}

export class UnspentTxOutUtil {
  /**
   * @description - Get unspent transaction outputs for a given address
   *
   * @param address
   * @param unspentTxOuts
   */
  public static getUnspentTxOuts(address: string, unspentTxOuts: UnspentTxOut[]): UnspentTxOut[] {
    return unspentTxOuts.filter(unspentTxOut => unspentTxOut.address === address);
  }

  /**
   * @description - Check txIn reference txOut is in the unspent transaction outputs
   *
   * @param txIn
   * @param unspentTxOuts
   */
  public static hasTxIn(txIn: TxIn, unspentTxOuts: UnspentTxOut[]): boolean {
    return !!unspentTxOuts.find(unspentTxOut => unspentTxOut.txOutId === txIn.txOutId && unspentTxOut.txOutIndex === txIn.txOutIndex);
  }
}