export class WalletUtil {

  public static validatePublicKey(publicKey: string): { res: boolean, error: Error } {
    if (publicKey.length !== 130) {
      return { res: false, error: new Error('Invalid address length (invalid is 130)') };
    } else if (publicKey.match('^[a-fA-F0-9]+$') === null) {
      return { res: false, error: new Error('Invalid address format') };
    } else if (!publicKey.startsWith('04')) {
      return { res: false, error: new Error('Invalid address format (must start with 04)') };
    }
    return { res: true, error: null };
  }

}
