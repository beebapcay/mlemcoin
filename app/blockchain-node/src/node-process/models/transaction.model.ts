import { ConfigurationConstants } from '@shared/constants';
import { EncryptUtil } from '@shared/utils/encrypt.util';
import { TransactionValidator } from '../validators/transaction.validator';
import { TxIn } from './tx-in.model';
import { TxOut } from './tx-out.model';
import { UnspentTxOut, UnspentTxOutUtil } from './unspent-tx-out.model';

export class Transaction {
  constructor(
    public id: string,
    public txIns: TxIn[],
    public txOuts: TxOut[]
  ) {
  }
}

export class TransactionUtil {
  /**
   * @description - Get the transaction id
   *
   * @param transaction
   */
  public static getTransactionId(transaction: Transaction): string {
    const txInContent: string = transaction.txIns
      .map((txIn: TxIn) => txIn.txOutId + txIn.txOutIndex)
      .reduce((a, b) => a + b, '');

    const txOutContent: string = transaction.txOuts
      .map((txOut: TxOut) => txOut.address + txOut.amount)
      .reduce((a, b) => a + b, '');

    return EncryptUtil.calculateHash(txInContent + txOutContent);
  }

  /**
   * @description - Create the coinbase transaction
   *
   * @param address
   * @param blockIndex
   */
  public static createCoinbaseTransaction(address: string, blockIndex: number): Transaction {
    const txIn: TxIn = new TxIn('', blockIndex, '');
    const txOut: TxOut = new TxOut(address, ConfigurationConstants.COINBASE_AMOUNT);

    const coinbaseTransaction: Transaction = new Transaction('', [txIn], [txOut]);
    coinbaseTransaction.id = TransactionUtil.getTransactionId(coinbaseTransaction);

    return coinbaseTransaction;
  }

  /**
   * @description - Process transactions from unspentTxOuts
   *
   * @param transactions
   * @param aUnspentTxOuts
   * @param blockIndex
   */
  public static processTransactions(transactions: Transaction[], aUnspentTxOuts: UnspentTxOut[], blockIndex: number): UnspentTxOut[] {
    if (!TransactionValidator.validateStructureList(transactions)) {
      throw new Error('Have some invalid structure in transactions');
    }

    if (!TransactionValidator.validateBlockTransactions(transactions, aUnspentTxOuts, blockIndex)) {
      throw new Error('Invalid block transactions');
    }

    return UnspentTxOutUtil.update(transactions, aUnspentTxOuts);
  }
}