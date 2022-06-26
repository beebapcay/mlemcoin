import { Transaction, TransactionUtil } from "@models/transaction.model";
import { UnspentTxOut } from '@models/unspent-tx-out.model';
import { Database } from '@repos/database';
import { UnspentTxOutRepo } from '@repos/unspent-tx-out.repo';
import { TransactionValidator } from '@validators/transaction.validator';

export class TransactionRepo {
  /**
   * @description - Process transactions from DB unspentTxOuts
   *
   * @param transactions
   * @param blockIndex
   */
  static async processTransactions(transactions: Transaction[], blockIndex: number): Promise<UnspentTxOut[]> {
    return TransactionUtil.processTransactions(transactions, Database.UnspentTxOutsDB, blockIndex);
  }
}

