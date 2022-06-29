import { Transaction } from '@node-process/models/transaction.model';
import { TxIn } from '@node-process/models/tx-in.model';
import { UnspentTxOut, UnspentTxOutUtil } from '@node-process/models/unspent-tx-out.model';
import { EncryptUtil } from '@node-process/utils/encrypt.util';
import { InvalidSignature, ReferenceTxOutNotFound } from '@shared/errors';
import { ErrorUtil } from '@shared/utils/error.util';

// noinspection SuspiciousTypeOfGuard
export class TxInValidator {
  /**
   * @description - Validates a TxIn
   *
   * @param txIn
   * @param transaction
   * @param aUnspentTxOuts
   */
  public static validate(txIn: TxIn, transaction: Transaction, aUnspentTxOuts: UnspentTxOut[]): boolean {
    const referencedUTxO = UnspentTxOutUtil.getOne(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts);

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
   * @description - Validates a list of TxIns
   *
   * @param txIns
   * @param transaction
   * @param aUnspentTxOuts
   */
  public static validateList(txIns: TxIn[], transaction: Transaction, aUnspentTxOuts: UnspentTxOut[]): boolean {
    return txIns.map((txIn) => TxInValidator.validate(txIn, transaction, aUnspentTxOuts)).reduce((a, b) => a && b, true);
  }

  /**
   * @description - Validates the structure of a TxIn
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
   * @description - Validates the structure of a list of TxIns
   *
   * @param txIns
   */
  public static validateStructureList(txIns: TxIn[]): boolean {
    return txIns.map((txIn) => TxInValidator.validateStructure(txIn)).reduce((a, b) => a && b, true);
  }
}