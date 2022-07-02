import { TxOut } from '@node-process/models/tx-out.model';
import { ErrorUtil } from '@shared/utils/error.util';

// noinspection SuspiciousTypeOfGuard
export class TxOutValidator {
  /**
   * @description - Validates the structure of a TxOut
   *
   * @param txOut
   */
  public static validateStructure(txOut: TxOut): boolean {
    if (txOut == null) {
      ErrorUtil.pError(new Error('TxIn is null'));
      return false;
    } else if (typeof txOut.address !== 'string') {
      ErrorUtil.pError(new Error('Invalid address type in txOut'));
      return false;
    } else if (!TxOutValidator.validateAddress(txOut.address)) {
      ErrorUtil.pError(new Error('Invalid address in txOut'));
      return false;
    } else if (typeof txOut.amount !== 'number') {
      ErrorUtil.pError(new Error('Invalid amount type in txOut'));
      return false;
    } else {
      return true;
    }
  };

  /**
   * @description - Validates the structure of a list of TxOuts
   *
   * @param txOuts
   */
  public static validateStructureList(txOuts: TxOut[]): boolean {
    return txOuts.map(TxOutValidator.validateStructure).reduce((a, b) => a && b, true);
  }

  /**
   * @description - Validates the address of a TxOut
   *
   * @param address
   */
  public static validateAddress(address: string): boolean {
    if (address.length !== 130) {
      ErrorUtil.pError(new Error('Invalid address length'));
      return false;
    } else if (address.match('^[a-fA-F0-9]+$') === null) {
      ErrorUtil.pError(new Error('Invalid address format'));
      return false;
    } else if (!address.startsWith('04')) {
      console.log('public key must start with 04');
      return false;
    }
    return true;
  }
}