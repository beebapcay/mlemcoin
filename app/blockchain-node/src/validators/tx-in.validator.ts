import { Transaction } from '@models/transaction.model';
import { TxIn } from '@models/tx-in.model';
import { UnspentTxOut } from '@models/unspent-tx-out.model';
import { InvalidSignature, ReferenceTxOutNotFound } from '@shared/errors';
import { EncryptUtil } from '@utils/encrypt.util';
import { ErrorUtil } from '@utils/error.util';

// noinspection SuspiciousTypeOfGuard
export class TxInValidator {
  /**
   * @description - Validate a TxIn
   *
   * @param txIn
   * @param transaction
   * @param aUnspentTxOuts
   */
  public static validate(txIn: TxIn, transaction: Transaction, aUnspentTxOuts: UnspentTxOut[]): boolean {
    const referencedUTxO = aUnspentTxOuts.find(
      (uTxO) => uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex
    );

    if (!referencedUTxO) {
      ErrorUtil.pError(new ReferenceTxOutNotFound(txIn.txOutId, txIn.txOutIndex));
      return false;
    }

    const resultVerifySignature = EncryptUtil.verifySignature(referencedUTxO.address, transaction.id, txIn.signature);
    if (!resultVerifySignature) {
      ErrorUtil.pError(new InvalidSignature());
      return false;
    }

    return true;
  }

  /**
   * @description - Validate a list of TxIns
   *
   * @param txIns
   * @param transaction
   * @param aUnspentTxOuts
   */
  public static validateList(txIns: TxIn[], transaction: Transaction, aUnspentTxOuts: UnspentTxOut[]): boolean {
    return txIns.map((txIn) => TxInValidator.validate(txIn, transaction, aUnspentTxOuts)).reduce((a, b) => a && b, true);
  }

  /**
   * @description - Validate the structure of a TxIn
   *
   * @param txIn
   */
  public static validateStructure(txIn: TxIn): boolean {
    if (txIn == null) {
      ErrorUtil.pError(new Error('TxIn is null'));
      return false;
    } else if (typeof txIn.signature !== 'string') {
      ErrorUtil.pError(new Error('Invalid signature type in txIn'));
      return false;
    } else if (typeof txIn.txOutId !== 'string') {
      ErrorUtil.pError(new Error('Invalid txOutId type in txIn'));
      return false;
    } else if (typeof txIn.txOutIndex !== 'number') {
      ErrorUtil.pError(new Error('Invalid txOutIndex type in txIn'));
      return false;
    } else {
      return true;
    }
  }

  /**
   * @description - Validate the structure of a list of TxIns
   *
   * @param txIns
   */
  public static validateStructureList(txIns: TxIn[]): boolean {
    return txIns.map((txIn) => TxInValidator.validateStructure(txIn)).reduce((a, b) => a && b, true);
  }
}