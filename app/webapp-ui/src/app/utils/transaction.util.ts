import { Transaction } from '../models/transaction.model';

export class TransactionUtil {
  static getSenderAddress(transaction: Transaction): string {
    const txIn = transaction.txIns[0];

    if (!txIn) return 'unknown';

    if (!txIn.txOutAddress) return 'mlem system';

    return txIn.txOutAddress;
  }

  static getReceiverAddress(transaction: Transaction): string {
    return transaction.txOuts[0]?.address || 'unknown';
  }

  static getTotalAmount(transaction: Transaction): number {
    return transaction.txOuts.reduce((total, txOut) => total + txOut.amount, 0);
  }

  static getSendToAmount(transaction: Transaction): number {
    const receiverAddress = TransactionUtil.getReceiverAddress(transaction);
    return transaction.txOuts?.reduce((amount, txOut) => {
      if (txOut.address === receiverAddress) return amount + txOut.amount;
      return amount;
    }, 0);
  }

  static getSendBackAmount(transaction: Transaction): number {
    return TransactionUtil.getTotalAmount(transaction) - TransactionUtil.getSendToAmount(transaction);
  }

  static getTransactionType(transaction: Transaction): string {
    const senderAddress = TransactionUtil.getSenderAddress(transaction);
    if (senderAddress === 'mlem system') return 'reward';
    if (senderAddress === 'unknown') return 'unknown';
    return 'transaction';
  }
}
