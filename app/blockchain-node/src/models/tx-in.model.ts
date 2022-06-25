import { Transaction } from '@models/transaction.model';
import { UnspentTxOut } from '@models/unspent-tx-out.model';
import { ReferenceTxOutNotFound, SignTransactionFromWrongAddress } from '@shared/errors';
import { EncryptUtil } from '../utils/encrypt.util';

export class TxIn {
  constructor(
    public readonly txOutId: string,
    public readonly txOutIndex: number,
    public readonly signature: string
  ) {
  }
}

export class TxInUtil {
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

    return EncryptUtil.signSignature(dataToSign, privateKey);
  }

  public static getTxInAmount(txIn: TxIn, aUnspentTxOuts: UnspentTxOut[]): number {
    const referencedUnspentTxOut = aUnspentTxOuts.find(txOut => txOut.txOutId === txIn.txOutId && txOut.txOutIndex === txIn.txOutIndex);

    if (!referencedUnspentTxOut) {
      throw new ReferenceTxOutNotFound(txIn.txOutId, txIn.txOutIndex);
    }

    return referencedUnspentTxOut.amount;
  }
}