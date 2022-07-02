import logger from 'jet-logger';
import { Transaction } from '../models/transaction.model';
import { UnspentTxOut, UnspentTxOutUtil } from '../models/unspent-tx-out.model';
import { Database } from './database';

export class UnspentTxOutRepo {
  /**
   * @description - Gets an unspent transaction output by its id and index.
   *
   * @param id
   * @param index
   *
   * @returns Promise<UnspentTxOut | undefined>
   */
  static async getOne(id: string, index: number): Promise<UnspentTxOut | undefined> {
    return UnspentTxOutUtil.getOne(id, index, Database.UnspentTxOutsDB);
  }

  /**
   * @description - Gets all unspent transaction outputs.
   *
   * @returns Promise<UnspentTxOut[]>
   */
  static async getAll(): Promise<UnspentTxOut[]> {
    return Database.UnspentTxOutsDB;
  }

  /**
   * @description - Gets all unspent transaction outputs by address.
   *
   * @param address
   *
   * @returns Promise<UnspentTxOut[]>
   */
  static async getByAddress(address: string): Promise<UnspentTxOut[]> {
    return UnspentTxOutUtil.getUnspentTxOuts(address, Database.UnspentTxOutsDB);
  }

  /**
   * @description - Checks if an unspent transaction output exists
   *
   * @param id
   * @param index
   *
   * @returns Promise<boolean>
   */
  static async exists(id: string, index: number): Promise<boolean> {
    return UnspentTxOutUtil.exists(id, index, Database.UnspentTxOutsDB);
  }

  /**
   * @description - Updates unspent transaction outputs DB with new transactions.
   *
   * @param newTransactions
   */
  static async update(newTransactions: Transaction[]): Promise<UnspentTxOut[]> {
    const resultingUnspentTxOuts = UnspentTxOutUtil.update(newTransactions, Database.UnspentTxOutsDB);
    Database.UnspentTxOutsDB = resultingUnspentTxOuts;

    return resultingUnspentTxOuts;
  }

  /**
   * @description - Replaces unspent transaction outputs DB with new ones.
   *
   * @param newUnspentTxOuts
   */
  public static async replace(newUnspentTxOuts: UnspentTxOut[]): Promise<void> {
    logger.info(`Replacing unspent transaction outputs`);
    Database.UnspentTxOutsDB = newUnspentTxOuts;
  }
}