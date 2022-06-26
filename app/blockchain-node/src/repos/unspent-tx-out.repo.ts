import { Transaction } from "@models/transaction.model";
import { UnspentTxOut, UnspentTxOutUtil } from "@models/unspent-tx-out.model";
import { Database } from "@repos/database";

export class UnspentTxOutRepo {
  /**
   * @description - Get an unspent transaction output by its id and index.
   *
   * @param id
   * @param index
   */
  static async getOne(id: string, index: number): Promise<UnspentTxOut | undefined> {
    return Database.UnspentTxOutsDB.find((uTxO) => uTxO.txOutId === id && uTxO.txOutIndex === index);
  }

  /**
   * @description - Get all unspent transaction outputs.
   */
  static async getAll(): Promise<UnspentTxOut[]> {
    return Database.UnspentTxOutsDB;
  }

  /**
   * @description - Get all unspent transaction outputs by address.
   *
   * @param address
   */
  static async getByAddress(address: string): Promise<UnspentTxOut[]> {
    return Database.UnspentTxOutsDB.filter((uTxO) => uTxO.address === address);
  }

  /**
   * @description - Check if an unspent transaction output exists.
   *
   * @param id
   * @param index
   */
  static async exists(id: string, index: number): Promise<boolean> {
    return !!(await UnspentTxOutRepo.getOne(id, index));
  }

  /**
   * @description - Update unspent transaction outputs DB with new transactions.
   *
   * @param newTransactions
   */
  static async update(newTransactions: Transaction[]): Promise<UnspentTxOut[]> {
    const resultingUnspentTxOuts = UnspentTxOutUtil.update(newTransactions, Database.UnspentTxOutsDB);
    Database.UnspentTxOutsDB = resultingUnspentTxOuts;

    return resultingUnspentTxOuts;
  }
}