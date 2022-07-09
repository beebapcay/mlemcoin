import { TxIn } from '../models/tx-in.model';
import { UnspentTxOut } from '../models/unspent-tx-out.model';

export class UnspentTxOutUtil {
  static getOne(id: string, index: number, unspentTxOuts: UnspentTxOut[]): UnspentTxOut | undefined {
    return unspentTxOuts.find((uTxO) => uTxO.txOutId === id && uTxO.txOutIndex === index);
  }

  static exists(id: string, index: number, unspentTxOuts: UnspentTxOut[]): boolean {
    return !!UnspentTxOutUtil.getOne(id, index, unspentTxOuts);
  }

  static getUnspentTxOuts(address: string, unspentTxOuts: UnspentTxOut[]): UnspentTxOut[] {
    return unspentTxOuts.filter(unspentTxOut => unspentTxOut.address === address);
  }

  static hasTxIn(txIn: TxIn, unspentTxOuts: UnspentTxOut[]): boolean {
    return UnspentTxOutUtil.exists(txIn.txOutId, txIn.txOutIndex, unspentTxOuts);
  }
}
