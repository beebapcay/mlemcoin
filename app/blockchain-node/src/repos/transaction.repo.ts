import { Transaction } from '@models/transaction.model';
import { UnspentTxOut } from '@models/unspent-tx-out.model';
import { DB } from '@repos/database';
import { UnspentTxOutRepo } from '@repos/unspent-tx-out.repo';
import { TransactionValidator } from '@validators/transaction.validator';

export class TransactionRepo {
  /**
   * @description - Process transactions from unspentTxOuts
   *
   * @param transactions
   * @param aUnspentTxOuts
   * @param blockIndex
   */
  static async processTransactionsFromUnspentTxOuts(transactions: Transaction[], aUnspentTxOuts: UnspentTxOut[], blockIndex: number): Promise<UnspentTxOut[]> {
    if (!TransactionValidator.validateStructureList(transactions)) {
      throw new Error('Have some invalid structure in transactions');
    }

    if (!TransactionValidator.validateBlockTransactions(transactions, aUnspentTxOuts, blockIndex)) {
      throw new Error('Invalid block transactions')
    }

    return UnspentTxOutRepo.updateFromUnspentTxOuts(transactions, aUnspentTxOuts);
  }

  /**
   * @description - Process transactions from DB unspentTxOuts
   *
   * @param transactions
   * @param blockIndex
   */
  static async processTransactions(transactions: Transaction[], blockIndex: number): Promise<UnspentTxOut[]> {
    return TransactionRepo.processTransactionsFromUnspentTxOuts(transactions, DB.unspentTxOuts, blockIndex);
  }
}

