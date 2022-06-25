import { TxIn } from '@models/tx-in.model';
import { UnspentTxOutRepo } from '@repos/unspent-tx-out.repo';

export class TxInRepo {
  /**
   * @description - Get amount of coins referenced by a txIn
   *
   * @param txIn
   */
  static async getTxInAmount(txIn: TxIn): Promise<number | undefined> {
    const unspentTxOut = await UnspentTxOutRepo.getOne(txIn.txOutId, txIn.txOutIndex);
    return unspentTxOut?.amount ?? undefined;
  }
}