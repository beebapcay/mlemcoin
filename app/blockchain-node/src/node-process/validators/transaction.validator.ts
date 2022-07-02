import { ConfigurationConstants } from '@node-process/constants/config.constant';
import { Transaction, TransactionUtil } from '@node-process/models/transaction.model';
import { TxIn, TxInUtil } from '@node-process/models/tx-in.model';
import { TxOut } from '@node-process/models/tx-out.model';
import { UnspentTxOut } from '@node-process/models/unspent-tx-out.model';
import { TxInValidator } from '@node-process/validators/tx-in.validator';
import { TxOutValidator } from '@node-process/validators/tx-out.validator';
import { CoinbaseTransactionEmpty } from '@shared/errors/coinbase-transaction-empty.error';
import { InvalidTransactionId } from '@shared/errors/invalid-transaction-id.error';
import { TxInAmountNotMatchTxOutAmount } from '@shared/errors/tx-in-amount-not-match-tx-out-amount.error';
import { ArrayUtil } from '@shared/utils/array.util';
import { ErrorUtil } from '@shared/utils/error.util';
import * as _ from 'lodash';

// noinspection SuspiciousTypeOfGuard
export class TransactionValidator {
  /**
   * @description - Validates a transaction
   *
   * @param transaction
   * @param aUnspentTxOuts
   */
  public static validate(transaction: Transaction, aUnspentTxOuts: UnspentTxOut[]): boolean {
    if (TransactionUtil.getTransactionId(transaction) !== transaction.id) {
      ErrorUtil.pError(new InvalidTransactionId());
      return false;
    }

    if (!TxInValidator.validateList(transaction.txIns, transaction, aUnspentTxOuts)) {
      ErrorUtil.pError(new Error('Have some invalid txIns'));
      return false;
    }

    const totalTxInAmount: number = transaction.txIns
      .map((txIn: TxIn) => TxInUtil.getTxInAmount(txIn, aUnspentTxOuts))
      .reduce((a, b) => a + b, 0);

    const totalTxOutAmount: number = transaction.txOuts.map((txOut: TxOut) => txOut.amount).reduce((a, b) => a + b, 0);

    if (totalTxOutAmount !== totalTxInAmount) {
      ErrorUtil.pError(new TxInAmountNotMatchTxOutAmount());
      return false;
    }

    return true;
  }

  /**
   * @description - Validates the structure of a transaction
   *
   * @param transaction
   */
  public static validateStructure = (transaction: Transaction) => {
    if (typeof transaction.id !== 'string') {
      ErrorUtil.pError(new Error('Invalid transaction id type'));
      return false;
    }

    if (!(transaction.txIns instanceof Array)) {
      ErrorUtil.pError(new Error('Invalid transaction txIns type'));
      return false;
    }

    if (!TxInValidator.validateStructureList(transaction.txIns)) {
      ErrorUtil.pError(new Error('Invalid transaction txIns structure'));
      return false;
    }

    if (!(transaction.txOuts instanceof Array)) {
      ErrorUtil.pError(new Error('Invalid transaction txOuts type'));
      return false;
    }

    if (!TxOutValidator.validateStructureList(transaction.txOuts)) {
      ErrorUtil.pError(new Error('Invalid transaction txOuts structure'));
      return false;
    }

    return true;
  };

  /**
   * @description - Validates a list of transactions
   *
   * @param transactions
   */
  public static validateStructureList = (transactions: Transaction[]) => {
    return transactions.map(TransactionValidator.validateStructure).reduce((a, b) => a && b, true);
  }

  /**
   * @description - Validates the coinbase transaction
   *
   * @param coinbaseTx
   * @param blockIndex
   */
  public static validateCoinbaseTransaction(coinbaseTx: Transaction, blockIndex: number): boolean {
    if (coinbaseTx === null) {
      ErrorUtil.pError(new CoinbaseTransactionEmpty());
      return false;
    }

    if (TransactionUtil.getTransactionId(coinbaseTx) !== coinbaseTx.id) {
      ErrorUtil.pError(new InvalidTransactionId());
      return false;
    }

    if (coinbaseTx.txIns.length !== 1) {
      ErrorUtil.pError(new Error('Coinbase transaction has no inputs. Expected 1 input'));
      return false;
    }

    if (coinbaseTx.txIns[0].txOutIndex !== blockIndex) {
      ErrorUtil.pError(new Error('Coinbase transaction input has an invalid index. Expected index to be the same as the block index'));
      return false;
    }

    if (coinbaseTx.txOuts.length !== 1) {
      ErrorUtil.pError(new Error('Coinbase transaction has no outputs. Expected 1 output'));
      return false;
    }

    if (coinbaseTx.txOuts[0].amount !== ConfigurationConstants.COINBASE_AMOUNT) {
      ErrorUtil.pError(new Error('Coinbase transaction output has an invalid amount. Expected amount to be ' + ConfigurationConstants.COINBASE_AMOUNT));
      return false;
    }

    return true;
  }

  /**
   * @description - Validates a transactions in a block
   *
   * @param aTransactions
   * @param aUnspentTxOuts
   * @param blockIndex
   */
  public static validateBlockTransactions(
    aTransactions: Transaction[],
    aUnspentTxOuts: UnspentTxOut[],
    blockIndex: number
  ): boolean {
    const coinbaseTx = aTransactions[0];

    if (!TransactionValidator.validateCoinbaseTransaction(coinbaseTx, blockIndex)) {
      ErrorUtil.pError(new Error('Invalid coinbase transaction'));
      return false;
    }

    const txIns: TxIn[] = _.flatten(aTransactions.map((tx: Transaction) => tx.txIns));

    if (ArrayUtil.hasDuplicates(txIns)) {
      ErrorUtil.pError(new Error("Duplicate txIns detected"));
      return false;
    }

    const normalTransactions: Transaction[] = aTransactions.slice(1);
    if (normalTransactions.length === 0) {
      return true;
    }

    return normalTransactions
      .map((tx: Transaction) => TransactionValidator.validate(tx, aUnspentTxOuts))
      .reduce((a, b) => a && b, true);
  }
}