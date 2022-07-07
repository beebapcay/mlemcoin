import { TxIn } from '../models/tx-in.model';
import { UnspentTxOut } from '../models/unspent-tx-out.model';
import { UnspentTxOutUtil } from './unspent-tx-out.util';

export class TxInUtil {
  static getReferenceUnspentTxOut(txIn: TxIn, unspentTxOuts: UnspentTxOut[]): UnspentTxOut | undefined {
    return UnspentTxOutUtil.getOne(txIn.txOutId, txIn.txOutIndex, unspentTxOuts);
  }
}
