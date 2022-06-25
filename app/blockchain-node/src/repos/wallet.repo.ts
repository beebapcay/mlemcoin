import { UnspentTxOutUtil } from '@models/unspent-tx-out.model';
import { WalletUtil } from '@models/wallet.model';
import { DB } from '@repos/database';
import { ConfigurationConstants } from '@shared/constants';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import logger from 'jet-logger';

export class WalletRepo {
  /**
   * @description - Creates a new wallet private key and saves it to the file system.
   */
  public static init() {
    if (existsSync(ConfigurationConstants.PRIVATE_KEY_LOCATION)) {
      return;
    }

    const privateKey = WalletUtil.generatePrivateKey();

    writeFileSync(ConfigurationConstants.PRIVATE_KEY_LOCATION, privateKey);
    logger.info(`Wallet created at ${ConfigurationConstants.PRIVATE_KEY_LOCATION}`);
  }

  /**
   * @description - Deletes the wallet private key from the file system.
   */
  public static delete() {
    if (existsSync(ConfigurationConstants.PRIVATE_KEY_LOCATION)) {
      unlinkSync(ConfigurationConstants.PRIVATE_KEY_LOCATION);
    }
  }

  /**
   * @description - Retrieves the wallet balance.
   *
   * @param address
   */
  public static async getBalance(address: string): Promise<number> {
    return UnspentTxOutUtil.getUnspentTxOuts(address, DB.unspentTxOuts)
      .map(unspentTxOut => unspentTxOut.amount)
      .reduce((acc, curr) => acc + curr, 0);
  }
}
