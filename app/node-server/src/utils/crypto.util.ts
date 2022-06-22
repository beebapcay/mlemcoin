import * as CryptoJS from 'crypto-js';
import { Block } from '../models/block.model';

export class CrytoUtil {
  static calculateHash(index: number, previousHash: string, timestamp: number, data: string): string {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
  }
}
