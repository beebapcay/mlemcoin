import { ConfigurationConstants } from '@node-process/constants/config.constant';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import logger from 'jet-logger';
import { UnspentTxOutUtil } from '../models/unspent-tx-out.model';
import { Wallet, WalletUtil } from '../models/wallet.model';
import { Database } from './database';

export class WalletRepo {
  /**
   * @description - Creates a new wallet private key and saves it to the file system.
   *
   * @returns Promise<boolean>
   */
  public static async init(): Promise<boolean> {
    if (existsSync(ConfigurationConstants.PRIVATE_KEY_LOCATION)) {
      return false;
    }

    const privateKey = WalletUtil.generatePrivateKey();

    writeFileSync(ConfigurationConstants.PRIVATE_KEY_LOCATION, privateKey);
    logger.info(`Wallet created at ${ConfigurationConstants.PRIVATE_KEY_LOCATION}`);

    return true;
  }

  /**
   * @description - Deletes the wallet private key from the file system.
   *
   * @returns Promise<boolean>
   */
  public static async delete(): Promise<boolean> {
    if (existsSync(ConfigurationConstants.PRIVATE_KEY_LOCATION)) {
      unlinkSync(ConfigurationConstants.PRIVATE_KEY_LOCATION);
      return true;
    }

    return false;
  }

  /**
   * @description - Retrieves the wallet balance.
   *
   * @param address
   *
   * @returns Promise<number>
   */
  public static async getBalance(address: string): Promise<number> {
    return UnspentTxOutUtil
      .getUnspentTxOuts(address, Database.UnspentTxOutsDB)
      .map(unspentTxOut => unspentTxOut.amount)
      .reduce((acc, curr) => acc + curr, 0);
  }

  /**
   * @description - Get the private key from the wallet file
   *
   * @returns Promise<string>
   */
  public static async getPrivateKey(): Promise<string> {
    const buffer = readFileSync(ConfigurationConstants.PRIVATE_KEY_LOCATION, "utf8");
    return buffer.toString();
  }

  public static async getPublicKey(): Promise<string> {
    const privateKey = await WalletRepo.getPrivateKey();
    return WalletUtil.getPublicKey(privateKey);
  }

  /**
   * @description - Get the wallet information
   *
   * @returns Promise<Wallet>
   */
  public static async get(): Promise<Wallet> {
    const privateKey = await WalletRepo.getPrivateKey();
    const publicKey = WalletUtil.getPublicKey(privateKey);
    const balance = await WalletRepo.getBalance(publicKey);
    return new Wallet({ address: publicKey, balance: balance, privateKey: privateKey, publicKey: publicKey });
  }
}