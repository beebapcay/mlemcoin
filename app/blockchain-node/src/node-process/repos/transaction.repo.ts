import { Transaction, TransactionUtil } from '@node-process/models/transaction.model';
import { UnspentTxOut } from '@node-process/models/unspent-tx-out.model';
import { Database } from '@node-process/repos/database';

export class TransactionRepo {
  /**
   * @description - Process transactions from DB unspent transaction outputs. Update DB unspent transaction outputs.
   *
   * @param transactions
   * @param blockIndex
   *
   * @returns Promise<UnspentTxOut[]>
   *
   * @throws Error - Have some invalid structure in transactions
   * @throws InvalidBlockTransactionsError
   */
  static async processTransactions(transactions: Transaction[], blockIndex: number): Promise<UnspentTxOut[]> {
    return TransactionUtil.processTransactions(transactions, Database.UnspentTxOutsDB, blockIndex);
  }
}

