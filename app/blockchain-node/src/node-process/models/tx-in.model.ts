import { Transaction } from '@node-process/models/transaction.model';
import { UnspentTxOut, UnspentTxOutUtil } from '@node-process/models/unspent-tx-out.model';
import { EncryptUtil } from '@node-process/utils/encrypt.util';
import { ReferenceTxOutNotFound } from '@shared/errors/reference-tx-out-not-found.error';
import { SignTransactionFromTxOutNotYourOwn } from '@shared/errors/sign-transaction-from-tx-out-not-your-own.error';
import { ObjectUtil } from '@shared/utils/object.util';

export interface ITxIn {
  txOutId: string;
  txOutIndex: number;
  signature: string;
}


export class TxIn extends ObjectUtil.autoImplement<ITxIn>() {
  constructor(txInShape: ITxIn) {
    super();
  }
}

export class TxInUtil {

  /**
   * @description - Signs a transaction input with a given private key.
   * First check is valid address is referenced in the transaction input.
   *
   * @param transaction
   * @param txInIndex
   * @param privateKey
   * @param aUnspentTxOuts
   *
   * @return string
   *
   * @throws ReferenceTxOutNotFound
   * @throws SignTransactionFromTxOutNotYourOwn
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
      throw new SignTransactionFromTxOutNotYourOwn();
    }

    return EncryptUtil.signSignature(privateKey, dataToSign);
  }

  /**
   * @description - Gets the amount of referenced unspent transaction output
   *
   * @param txIn
   * @param aUnspentTxOuts
   *
   * @return number
   *
   * @throws ReferenceTxOutNotFound
   */
  public static getTxInAmount(txIn: TxIn, aUnspentTxOuts: UnspentTxOut[]): number {
    const referencedUnspentTxOut = UnspentTxOutUtil.getOne(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts);

    if (!referencedUnspentTxOut) {
      throw new ReferenceTxOutNotFound(txIn.txOutId, txIn.txOutIndex);
    }

    return referencedUnspentTxOut.amount;
  }
}