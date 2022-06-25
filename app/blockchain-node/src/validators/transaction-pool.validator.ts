import { TransactionPool } from '@models/transaction-pool.model';
import { Transaction } from '@models/transaction.model';
import { TxIn } from '@models/tx-in.model';
import { ErrorUtil } from '@utils/error.util';

export class TransactionPoolValidator {
  /**
   * @description - Validate the transaction pool with a transaction
   *
   * @param transaction
   * @param aTransactionPool
   */
  public static validateTransactionInPool(transaction: Transaction, aTransactionPool: TransactionPool): boolean {
    const txPoolIns = aTransactionPool.getTxIns();

    const containsTxIn = (txInsInPool: TxIn[], txIn: TxIn) => {
      return txInsInPool.find(txInInPool => txInInPool.txOutId === txIn.txOutId && txInInPool.txOutIndex === txIn.txOutIndex);
    }

    for (const txIn of transaction.txIns) {
      if (containsTxIn(txPoolIns, txIn)) {
        ErrorUtil.pError(new Error('Transaction pool contains a TxIn'));
        return false;
      }
    }

    return true;
  }
}