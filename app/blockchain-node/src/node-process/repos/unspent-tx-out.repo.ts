import { Transaction } from '../models/transaction.model';
import { UnspentTxOut, UnspentTxOutUtil } from '../models/unspent-tx-out.model';
import { Database } from './database';

export class UnspentTxOutRepo {
  /**
   * @description - Gets an unspent transaction output by its id and index.
   *
   * @param id
   * @param index
   */
  static async getOne(id: string, index: number): Promise<UnspentTxOut | undefined> {
    return UnspentTxOutUtil.getOne(id, index, Database.UnspentTxOutsDB);
  }

  /**
   * @description - Gets all unspent transaction outputs.
   */
  static async getAll(): Promise<UnspentTxOut[]> {
    return Database.UnspentTxOutsDB;
  }

  /**
   * @description - Gets all unspent transaction outputs by address.
   *
   * @param address
   */
  static async getByAddress(address: string): Promise<UnspentTxOut[]> {
    return Database.UnspentTxOutsDB.filter((uTxO) => uTxO.address === address);
  }

  /**
   * @description - Checks if an unspent transaction output exists
   *
   * @param id
   * @param index
   */
  static async exists(id: string, index: number): Promise<boolean> {
    return !!(await UnspentTxOutRepo.getOne(id, index));
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


}