import { Transaction } from "@models/transaction.model";
import { UnspentTxOut } from "@models/unspent-tx-out.model";
import { ReferenceTxOutNotFound, SignTransactionFromWrongAddress } from "@shared/errors";
import { EncryptUtil } from "@utils/encrypt.util";

export class TxIn {
  constructor(
    public txOutId: string,
    public txOutIndex: number,
    public signature: string
  ) {
  }
}

export class TxInUtil {

  /**
   * @description - Sign a txIn with a given privateKey
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
    const referencedUnspentTxOut = aUnspentTxOuts.find(txOut => txOut.txOutId === txIn.txOutId && txOut.txOutIndex === txIn.txOutIndex);

    if (!referencedUnspentTxOut) {
      throw new ReferenceTxOutNotFound(txIn.txOutId, txIn.txOutIndex);
    }

    if (EncryptUtil.getPublicKey(privateKey) !== referencedUnspentTxOut.address) {
      throw new SignTransactionFromWrongAddress();
    }

    return EncryptUtil.signSignature(privateKey, dataToSign);
  }

  public static getTxInAmount(txIn: TxIn, aUnspentTxOuts: UnspentTxOut[]): number {
    const referencedUnspentTxOut = aUnspentTxOuts.find(txOut => txOut.txOutId === txIn.txOutId && txOut.txOutIndex === txIn.txOutIndex);

    if (!referencedUnspentTxOut) {
      throw new ReferenceTxOutNotFound(txIn.txOutId, txIn.txOutIndex);
    }

    return referencedUnspentTxOut.amount;
  }
}