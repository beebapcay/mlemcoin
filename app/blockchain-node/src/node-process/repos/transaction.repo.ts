import { Transaction, TransactionUtil } from '@node-process/models/transaction.model';
import { UnspentTxOut } from '@node-process/models/unspent-tx-out.model';
import { Database } from '@node-process/repos/database';

export class TransactionRepo {
  /**
   * @description - Process transactions from DB unspent transaction outputs
   *
   * @param transactions
   * @param blockIndex
   */
  static async processTransactions(transactions: Transaction[], blockIndex: number): Promise<UnspentTxOut[]> {
    return TransactionUtil.processTransactions(transactions, Database.UnspentTxOutsDB, blockIndex);
  }
}

