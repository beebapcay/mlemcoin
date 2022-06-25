import * as CryptoJS from 'crypto-js';
import { Transaction } from '../models/transaction.model';

export class CrytoUtil {
  static calculateHash(
    index: number,
    previousHash: string,
    timestamp: number,
    data: Transaction[],
    difficulty: number,
    nonce: number
  ): string {
    return CryptoJS.SHA256(index + previousHash + timestamp + data + difficulty + nonce).toString();
  }
}
