import { Transaction } from '@node-process/models/transaction.model';
import { UnspentTxOut, UnspentTxOutUtil } from '@node-process/models/unspent-tx-out.model';
import { EncryptUtil } from '@node-process/utils/encrypt.util';
import { ReferenceTxOutNotFound, SignTransactionFromWrongAddress } from '@shared/errors';
import { InterfaceUtil } from '@shared/utils/interface.util';

export interface ITxIn {
  txOutId: string;
  txOutIndex: number;
  signature: string;
}


export class TxIn extends InterfaceUtil.autoImplement<ITxIn>() {
  constructor(txInShape: ITxIn) {
    super();
  }
}

export class TxInUtil {

  /**
   * @description - Signs a tx in with a given private key
   *
   * @param transaction
   * @param txInIndex
   * @param privateKey
   * @param aUnspentTxOuts
   */
  public static signTxIn(
    transaction: Transaction,
    txInIndex: number,
    privateKey: string,
    aUnspentTxOuts: UnspentTxOut[]
  ): string {
    const txIn = transaction.txIns[txInIndex];

    const dataToSign = transaction.id;
    const referencedUnspentTxOut = UnspentTxOutUtil.getOne(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts);

    if (!referencedUnspentTxOut) {
      throw new ReferenceTxOutNotFound(txIn.txOutId, txIn.txOutIndex);
    }

    if (EncryptUtil.getPublicKey(privateKey) !== referencedUnspentTxOut.address) {
      throw new SignTransactionFromWrongAddress();
    }

    return EncryptUtil.signSignature(privateKey, dataToSign);
  }

  /**
   * @description - Gets the amount if referenced unspent transaction output
   *
   * @param txIn
   * @param aUnspentTxOuts
   */
  public static getTxInAmount(txIn: TxIn, aUnspentTxOuts: UnspentTxOut[]): number {
    const referencedUnspentTxOut = UnspentTxOutUtil.getOne(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts);

    if (!referencedUnspentTxOut) {
      throw new ReferenceTxOutNotFound(txIn.txOutId, txIn.txOutIndex);
    }

    return referencedUnspentTxOut.amount;
  }
}