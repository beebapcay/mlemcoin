import * as CryptoJS from 'crypto-js';
import * as ecdsa from 'elliptic';
import * as _ from 'lodash';

const ec = new ecdsa.ec('secp256k1');

const COINBASE_AMOUNT = 50;

export class UnspentTxOut {
  constructor(
    public readonly txOutId: string,
    public readonly txOutIndex: number,
    public readonly address: string,
    public readonly amount: number
  ) {}

  public static findUnspentTxOut(
    transactionId: string,
    index: number,
    aUnspentTxOuts: UnspentTxOut[]
  ): UnspentTxOut | undefined {
    return aUnspentTxOuts.find((uTxO) => uTxO.txOutId === transactionId && uTxO.txOutIndex === index);
  }

  public static updateUnspentTxOuts(newTransactions: Transaction[], aUnspentTxOuts: UnspentTxOut[]): UnspentTxOut[] {
    const newUnspentTxOuts: UnspentTxOut[] = newTransactions
      .map((t) => {
        return t.txOuts.map((txOut, index) => new UnspentTxOut(t.id, index, txOut.address, txOut.amount));
      })
      .reduce((a, b) => a.concat(b), []);

    const consumedTxOuts: UnspentTxOut[] = newTransactions
      .map((t) => t.txIns)
      .reduce((a, b) => a.concat(b), [])
      .map((txIn) => new UnspentTxOut(txIn.txOutId, txIn.txOutIndex, '', 0));

    const resultingUnspentTxOuts = aUnspentTxOuts
      .filter((uTxO) => !UnspentTxOut.findUnspentTxOut(uTxO.txOutId, uTxO.txOutIndex, consumedTxOuts))
      .concat(newUnspentTxOuts);

    return resultingUnspentTxOuts;
  }
}

export class TxIn {
  constructor(public readonly txOutId: string, public readonly txOutIndex: number, public readonly signature: string) {}

  public static validateTxIn(txIn: TxIn, transaction: Transaction, aUnspentTxOuts: UnspentTxOut[]): boolean {
    const referencedUTxO = aUnspentTxOuts.find(
      (uTxO) => uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex
    );

    if (!referencedUTxO) {
      console.log(`No referenced UTxO found for txIn=${JSON.stringify(txIn)}`);
      return false;
    }

    const address = referencedUTxO.address;

    const key = ec.keyFromPublic(address, 'hex');
    return key.verify(transaction.id, txIn.signature);
  }

  public static getTxInAmount(txIn: TxIn, aUnspentTxOuts: UnspentTxOut[]): number {
    return UnspentTxOut.findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts)?.amount ?? 0;
  }

  public static signTxIn(
    transaction: Transaction,
    txInIndex: number,
    privateKey: string,
    aUnspentTxOuts: UnspentTxOut[]
  ): string {
    const txIn = transaction.txIns[txInIndex];

    const dataToSign = transaction.id;
    const referencedUnspentTxOut = UnspentTxOut.findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts);

    if (!referencedUnspentTxOut) {
      throw new Error('No referenced UTxO found');
    }

    const referencedAddress = referencedUnspentTxOut.address;
    if (getPublicKey(privateKey) !== referencedAddress) {
      throw new Error('Trying to sign an input with private key of another address');
    }

    const key = ec.keyFromPrivate(privateKey, 'hex');
    const signature = toHexString(key.sign(dataToSign).toDER());

    return signature;
  }

  public static isValidTxInStructure = (txIn: TxIn): boolean => {
    if (txIn == null) {
      console.log('txIn is null');
      return false;
    } else if (typeof txIn.signature !== 'string') {
      console.log('invalid signature type in txIn');
      return false;
    } else if (typeof txIn.txOutId !== 'string') {
      console.log('invalid txOutId type in txIn');
      return false;
    } else if (typeof txIn.txOutIndex !== 'number') {
      console.log('invalid txOutIndex type in txIn');
      return false;
    } else {
      return true;
    }
  };
}

export class TxOut {
  constructor(public readonly address: string, public readonly amount: number) {}

  public static isValidTxOutStructure = (txOut: TxOut): boolean => {
    if (txOut == null) {
      console.log('txOut is null');
      return false;
    } else if (typeof txOut.address !== 'string') {
      console.log('invalid address type in txOut');
      return false;
    } else if (!isValidAddress(txOut.address)) {
      console.log('invalid TxOut address');
      return false;
    } else if (typeof txOut.amount !== 'number') {
      console.log('invalid amount type in txOut');
      return false;
    } else {
      return true;
    }
  };
}

export class Transaction {
  constructor(public id: string, public readonly txIns: TxIn[], public readonly txOuts: TxOut[]) {}

  public static getTransactionId(transaction: Transaction): string {
    const txInContent: string = transaction.txIns
      .map((txIn: TxIn) => txIn.txOutId + txIn.txOutIndex)
      .reduce((a, b) => a + b, '');

    const txOutContent: string = transaction.txOuts
      .map((txOut: TxOut) => txOut.address + txOut.amount)
      .reduce((a, b) => a + b, '');

    return CryptoJS.SHA256(txInContent + txOutContent).toString();
  }

  public static getCoinbaseTransaction(address: string, blockIndex: number): Transaction {
    const txIn: TxIn = new TxIn('', blockIndex, '');
    const txOut: TxOut = new TxOut(address, COINBASE_AMOUNT);

    const coinbaseTransaction: Transaction = new Transaction('', [txIn], [txOut]);
    coinbaseTransaction.id = Transaction.getTransactionId(coinbaseTransaction);

    return coinbaseTransaction;
  }

  public static validateTransaction(transaction: Transaction, aUnspentTxOuts: UnspentTxOut[]): boolean {
    if (Transaction.getTransactionId(transaction) !== transaction.id) {
      console.log('invalid tx id');
      return false;
    }

    const hasValidTxIns: boolean = transaction.txIns
      .map((txIn: TxIn) => TxIn.validateTxIn(txIn, transaction, aUnspentTxOuts))
      .reduce((a, b) => a && b, true);

    if (!hasValidTxIns) {
      console.log('some txIns are invalid');
      return false;
    }

    const totalTxInValues: number = transaction.txIns
      .map((txIn: TxIn) => TxIn.getTxInAmount(txIn, aUnspentTxOuts))
      .reduce((a, b) => a + b, 0);

    const totalTxOutAmount: number = transaction.txOuts.map((txOut: TxOut) => txOut.amount).reduce((a, b) => a + b, 0);

    if (totalTxOutAmount !== totalTxInValues) {
      console.log('totalTxOutAmount !== totalTxInValues');
      return false;
    }

    return true;
  }

  public static processTransactions(transactions: Transaction[], aUnspentTxOuts: UnspentTxOut[], blockIndex: number) {
    if (!Transaction.isValidTransactionsStructure(transactions)) {
      console.log('invalid transactions structure');
      return;
    }

    if (!Transaction.validateBlockTransactions(transactions, aUnspentTxOuts, blockIndex)) {
      console.log('invalid block transactions');
      return null;
    }

    return UnspentTxOut.updateUnspentTxOuts(transactions, aUnspentTxOuts);
  }

  public static isValidTransactionsStructure = (transactions: Transaction[]): boolean => {
    return transactions.map(Transaction.isValidTransactionStructure).reduce((a, b) => a && b, true);
  };

  public static isValidTransactionStructure = (transaction: Transaction) => {
    if (typeof transaction.id !== 'string') {
      console.log('transactionId missing');
      return false;
    }
    if (!(transaction.txIns instanceof Array)) {
      console.log('invalid txIns type in transaction');
      return false;
    }
    if (!transaction.txIns.map(TxIn.isValidTxInStructure).reduce((a, b) => a && b, true)) {
      return false;
    }

    if (!(transaction.txOuts instanceof Array)) {
      console.log('invalid txIns type in transaction');
      return false;
    }

    if (!transaction.txOuts.map(TxOut.isValidTxOutStructure).reduce((a, b) => a && b, true)) {
      return false;
    }
    return true;
  };

  public static validateBlockTransactions(
    aTransactions: Transaction[],
    aUnspentTxOuts: UnspentTxOut[],
    blockIndex: number
  ): boolean {
    const coinbaseTx = aTransactions[0];

    if (Transaction.validateCoinbaseTx(coinbaseTx, blockIndex)) {
      console.log('invalid coinbase transaction');
      return false;
    }

    const txIns: TxIn[] = _.flatten(aTransactions.map((tx: Transaction) => tx.txIns));

    if (hasDuplicates(txIns)) {
      console.log('some txIns are duplicate');
      return false;
    }

    const normalTransactions: Transaction[] = aTransactions.slice(1);
    return normalTransactions
      .map((tx: Transaction) => Transaction.validateTransaction(tx, aUnspentTxOuts))
      .reduce((a, b) => a && b, true);
  }

  public static validateCoinbaseTx(coinbaseTx: Transaction, blockIndex: number): boolean {
    if (coinbaseTx === null) {
      console.log('the first transaction in the block is not coinbase transaction');
      return false;
    }

    if (Transaction.getTransactionId(coinbaseTx) !== coinbaseTx.id) {
      console.log('invalid coinbase tx id');
      return false;
    }

    if (coinbaseTx.txIns.length !== 1) {
      console.log('one txIn is expected');
      return false;
    }

    if (coinbaseTx.txIns[0].txOutIndex !== blockIndex) {
      console.log('the txIn index in coinbase tx is not the block index');
      return false;
    }

    if (coinbaseTx.txOuts.length !== 1) {
      console.log('one txOut is expected');
      return false;
    }

    if (coinbaseTx.txOuts[0].amount !== COINBASE_AMOUNT) {
      console.log('invalid coinbase amount in coinbase transaction');
      return false;
    }

    return true;
  }
}

const hasDuplicates = (txIns: TxIn[]): boolean => {
  const groups = _.countBy(txIns, (txIn: TxIn) => txIn.txOutId + txIn.txOutIndex);
  return _.some(groups, (val: number) => val > 1);
};

const getPublicKey = (privateKey: string): string => {
  return ec.keyFromPrivate(privateKey, 'hex').getPublic().encode('hex', false);
};

const toHexString = (byteArray: any): string => {
  return Array.from(byteArray, (byte: any) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
};

const isValidAddress = (address: string): boolean => {
  if (address.length !== 130) {
    console.log('invalid public key length');
    return false;
  } else if (address.match('^[a-fA-F0-9]+$') === null) {
    console.log('public key must contain only hex characters');
    return false;
  } else if (!address.startsWith('04')) {
    console.log('public key must start with 04');
    return false;
  }
  return true;
};
