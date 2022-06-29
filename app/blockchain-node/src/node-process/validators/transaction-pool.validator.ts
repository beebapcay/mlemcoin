import { TransactionPool } from '@node-process/models/transaction-pool.model';
import { Transaction } from '@node-process/models/transaction.model';
import { TxIn } from '@node-process/models/tx-in.model';
import { ErrorUtil } from '@shared/utils/error.util';


export class TransactionPoolValidator {
  /**
   * @description - Validate the transaction can be added to the transaction pool
   *
   * @param transaction
   * @param transactionPool
   */
  public static validateTransactionInPool(transaction: Transaction, transactionPool: TransactionPool): boolean {
    const txPoolIns = transactionPool.getTxIns();

    const containsTxIn = (txInsInPool: TxIn[], txIn: TxIn) => {
      return txInsInPool.find(txInInPool => txInInPool.txOutId === txIn.txOutId && txInInPool.txOutIndex === txIn.txOutIndex);
    };

    for (const txIn of transaction.txIns) {
      if (containsTxIn(txPoolIns, txIn)) {
        ErrorUtil.pError(new Error('Transaction pool contains a TxIn'));
        return false;
      }
    }

    return true;
  }
}