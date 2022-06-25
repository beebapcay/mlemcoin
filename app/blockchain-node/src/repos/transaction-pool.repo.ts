import { TransactionPool } from '@models/transaction-pool.model';
import { Transaction } from '@models/transaction.model';
import { UnspentTxOut, UnspentTxOutUtil } from '@models/unspent-tx-out.model';
import { DB } from '@repos/database';
import { TransactionPoolValidator } from '@validators/transaction-pool.validator';
import { TransactionValidator } from '@validators/transaction.validator';
import logger from 'jet-logger';
import * as _ from 'lodash';

export class TransactionPoolRepo {
  /**
   * @description - Get the transaction pool
   */
  public static async get(): Promise<TransactionPool> {
    return DB.transactionPool;
  }

  /**
   * @description - Add a transaction to the transaction pool
   *
   * @param tx
   */
  public static async add(tx: Transaction): Promise<void> {
    const unspentTxOuts = DB.unspentTxOuts;

    if (!TransactionValidator.validate(tx, unspentTxOuts)) {
      throw new Error('Invalid transaction');
    }

    if (!TransactionPoolValidator.validateTransactionInPool(tx, DB.transactionPool)) {
      throw new Error('Trying to add an already existing txIn transaction');
    }

    DB.transactionPool.transactions.push(tx);
  }

  /**
   * @description - Remove a transaction invalid from the transaction pool
   *
   * @param unspentTxOuts
   */
  public static update(unspentTxOuts: UnspentTxOut[]) {
    const invalidTxs: Transaction[] = [];

    for (const tx of DB.transactionPool.transactions) {
      for (const txIn of tx.txIns) {
        if (!UnspentTxOutUtil.hasTxIn(txIn, unspentTxOuts)) {
          invalidTxs.push(tx);
          break;
        }
      }
    }

    if (invalidTxs.length > 0) {
      logger.info(`Removing ${invalidTxs.length} invalid transactions`);
      DB.transactionPool.transactions = _.without(DB.transactionPool.transactions, ...invalidTxs);
    }
  }

}