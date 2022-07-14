import { ErrorUtil } from '@shared/utils/error.util';

export class WalletValidator {
  /**
   * @description - Validates the public key or address
   *
   * @param publicKey
   */
  public static validatePublicKey(publicKey: string): boolean {
    if (publicKey.length !== 130) {
      ErrorUtil.pError(new Error('Invalid address length'));
      return false;
    } else if (publicKey.match('^[a-fA-F0-9]+$') === null) {
      ErrorUtil.pError(new Error('Invalid address format'));
      return false;
    } else if (!publicKey.startsWith('04')) {
      console.log('public key must start with 04');
      return false;
    }
    return true;
  }

  /**
   * @description - Validates the private key
   *
   * @param privateKey
   */
  public static validatePrivateKey(privateKey: string): boolean {
    if (privateKey.length !== 64) {
      ErrorUtil.pError(new Error('Invalid private key length'));
      return false;
    } else if (privateKey.match('^[a-fA-F0-9]+$') === null) {
      ErrorUtil.pError(new Error('Invalid private key format'));
      return false;
    }
    return true;
  }
}