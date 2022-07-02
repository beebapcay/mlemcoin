import { ConfigurationConstants } from '@node-process/constants/config.constant';
import { TxIn } from '@node-process/models/tx-in.model';
import { TxOut } from '@node-process/models/tx-out.model';
import { UnspentTxOut, UnspentTxOutUtil } from '@node-process/models/unspent-tx-out.model';
import { EncryptUtil } from '@node-process/utils/encrypt.util';
import { TransactionValidator } from '@node-process/validators/transaction.validator';
import { InvalidBlockTransactionsError } from '@shared/errors/invalid-block-transaction.error';
import { ObjectUtil } from '@shared/utils/object.util';

export interface ITransaction {
  id: string;
  txIns: TxIn[];
  txOuts: TxOut[];
}

export class Transaction extends ObjectUtil.autoImplement<ITransaction>() {
  constructor(transactionShape: ITransaction) {
    super();
    this.id = transactionShape.id;
    this.txIns = transactionShape.txIns;
    this.txOuts = transactionShape.txOuts;
  }
}

export class TransactionUtil {
  /**
   * @description - Gets the transaction id. Calculates from content of txIns (excluded signature) and txOuts
   *
   * @param transaction
   *
   * @returns string
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
   * @description - Creates the coinbase transaction. As a reward for the miner, he gets COINBASE_AMOUNT coins
   *
   * @param address
   * @param blockIndex
   *
   * @returns Transaction
   */
  public static createCoinbaseTransaction(address: string, blockIndex: number): Transaction {
    const txIn: TxIn = new TxIn({ txOutId: '', txOutIndex: blockIndex, signature: '' });
    const txOut: TxOut = new TxOut({ address: address, amount: ConfigurationConstants.COINBASE_AMOUNT });

    const coinbaseTransaction: Transaction = new Transaction({ id: '', txIns: [txIn], txOuts: [txOut] });
    coinbaseTransaction.id = TransactionUtil.getTransactionId(coinbaseTransaction);

    return coinbaseTransaction;
  }

  /**
   * @description - Processes transactions and then updates the unspent transaction outputs
   *
   * @param transactions
   * @param aUnspentTxOuts
   * @param blockIndex
   *
   * @returns UnspentTxOut[]
   *
   * @throws Error - Have some invalid structure in transactions
   * @throws InvalidBlockTransactionsError
   */
  public static processTransactions(transactions: Transaction[], aUnspentTxOuts: UnspentTxOut[], blockIndex: number): UnspentTxOut[] {
    if (!TransactionValidator.validateStructureList(transactions)) {
      throw new Error('Have some invalid structure in transactions');
    }

    if (!TransactionValidator.validateBlockTransactions(transactions, aUnspentTxOuts, blockIndex)) {
      throw new InvalidBlockTransactionsError();
    }

    return UnspentTxOutUtil.update(transactions, aUnspentTxOuts);
  }
}