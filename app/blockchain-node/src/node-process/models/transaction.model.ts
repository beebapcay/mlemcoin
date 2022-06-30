import { ConfigurationConstants } from '@node-process/constants/config.constant';
import { TxIn } from '@node-process/models/tx-in.model';
import { TxOut } from '@node-process/models/tx-out.model';
import { UnspentTxOut, UnspentTxOutUtil } from '@node-process/models/unspent-tx-out.model';
import { EncryptUtil } from '@node-process/utils/encrypt.util';
import { TransactionValidator } from '@node-process/validators/transaction.validator';
import { InterfaceUtil } from '@shared/utils/interface.util';

export interface ITransaction {
  id: string;
  txIns: TxIn[];
  txOuts: TxOut[];
}

export class Transaction extends InterfaceUtil.autoImplement<ITransaction>() {
  constructor(transactionShape: ITransaction) {
    super();
  }
}

export class TransactionUtil {
  /**
   * @description - Gets the transaction id
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
   * @description - Creates the coinbase transaction
   *
   * @param address
   * @param blockIndex
   */
  public static createCoinbaseTransaction(address: string, blockIndex: number): Transaction {
    const txIn: TxIn = new TxIn('', blockIndex, '');
    const txOut: TxOut = new TxOut(address, ConfigurationConstants.COINBASE_AMOUNT);

    const coinbaseTransaction: Transaction = new Transaction({ id: '', txIns: [txIn], txOuts: [txOut] });
    coinbaseTransaction.id = TransactionUtil.getTransactionId(coinbaseTransaction);

    return coinbaseTransaction;
  }

  /**
   * @description - Processes transactions and updates the unspent tx outs
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