import { Transaction } from '@models/transaction.model';
import { UnspentTxOut } from '@models/unspent-tx-out.model';
import { DB } from '@repos/database';

export class UnspentTxOutRepo {
  /**
   * @description - Get an unspent transaction output by its id and index.
   *
   * @param id
   * @param index
   */
  static async getOne(id: string, index: number): Promise<UnspentTxOut | undefined> {
    return DB.unspentTxOuts.find((uTxO) => uTxO.txOutId === id && uTxO.txOutIndex === index);
  }

  /**
   * @description - Get all unspent transaction outputs.
   */
  static async getAll(): Promise<UnspentTxOut[]> {
    return DB.unspentTxOuts;
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
    const resultingUnspentTxOuts = await UnspentTxOutRepo.updateFromUnspentTxOuts(newTransactions, DB.unspentTxOuts);
    DB.unspentTxOuts = resultingUnspentTxOuts;

    return resultingUnspentTxOuts;
  }

  /**
   * @description - Update unspent transaction outputs with new transactions.
   *
   * @param newTransactions
   * @param aUnspentTxOut
   */
  static async updateFromUnspentTxOuts(newTransactions: Transaction[], aUnspentTxOut: UnspentTxOut[]): Promise<UnspentTxOut[]> {
    const newUnspentTxOuts = newTransactions
      .map((t) => {
        return t.txOuts.map((txOut, index) => new UnspentTxOut(t.id, index, txOut.address, txOut.amount));
      })
      .reduce((a, b) => a.concat(b), []);

    const consumedTxOuts = newTransactions
      .map((t) => t.txIns)
      .reduce((a, b) => a.concat(b), [])
      .map((txIn) => new UnspentTxOut(txIn.txOutId, txIn.txOutIndex, '', 0));

    return aUnspentTxOut
      .filter((uTxO) =>
        !consumedTxOuts.find((consumed) => consumed.txOutId === uTxO.txOutId && consumed.txOutIndex === uTxO.txOutIndex)
      )
      .concat(newUnspentTxOuts);
  }
}