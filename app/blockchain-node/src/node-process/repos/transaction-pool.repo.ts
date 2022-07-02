import { TransactionPool } from '@node-process/models/transaction-pool.model';
import { Transaction } from '@node-process/models/transaction.model';
import { UnspentTxOut, UnspentTxOutUtil } from '@node-process/models/unspent-tx-out.model';
import { TransactionPoolValidator } from '@node-process/validators/transaction-pool.validator';
import { TransactionValidator } from '@node-process/validators/transaction.validator';
import { InvalidTransaction } from '@shared/errors/invalid-transaction.error';
import logger from 'jet-logger';
import * as _ from 'lodash';
import { Database } from './database';

export class TransactionPoolRepo {
  /**
   * @description - Gets the transaction pool
   */
  public static async get(): Promise<TransactionPool> {
    return Database.TransactionPoolDB;
  }

  /**
   * @description - Gets the transaction in transaction pool by id
   *
   * @param id
   *
   * @returns Promise<Transaction|undefined>
   */
  public static async getById(id: string): Promise<Transaction | undefined> {
    return Database.TransactionPoolDB.transactions.find(tx => tx.id === id);
  }

  /**
   * @description - Adds a transaction to the transaction pool
   *
   * @param tx
   *
   * @returns Promise<TransactionPool>
   *
   * @throws InvalidTransaction
   * @throws Error - Trying to add an invalid transaction to the pool
   */
  public static async add(tx: Transaction): Promise<void> {
    const unspentTxOuts = Database.UnspentTxOutsDB;

    if (!TransactionValidator.validate(tx, unspentTxOuts)) {
      throw new InvalidTransaction();
    }

    if (!TransactionPoolValidator.validateTransactionInPool(tx, Database.TransactionPoolDB)) {
      throw new Error('Trying to add an invalid transaction to the pool');
    }

    Database.TransactionPoolDB.transactions.push(tx);
  }

  /**
   * @description - Updates by remove a transaction invalid from the transaction pool
   *
   * @param unspentTxOuts
   */
  public static async update(unspentTxOuts: UnspentTxOut[]): Promise<TransactionPool> {
    const invalidTxs: Transaction[] = [];

    for (const tx of Database.TransactionPoolDB.transactions) {
      for (const txIn of tx.txIns) {
        if (!UnspentTxOutUtil.hasTxIn(txIn, unspentTxOuts)) {
          invalidTxs.push(tx);
          break;
        }
      }
    }

    if (invalidTxs.length > 0) {
      logger.info(`Removing ${invalidTxs.length} invalid transactions`);
      Database.TransactionPoolDB.transactions = _.without(Database.TransactionPoolDB.transactions, ...invalidTxs);
    }

    return Database.TransactionPoolDB;
  }
}