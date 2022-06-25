import { CrytoUtil } from '../utils/crypto.util';
import { Transaction } from './transaction.model';

const hexToBinary = require('hex-to-binary');

export class Block {
  constructor(
    public index: number,
    public timestamp: number,
    public hash: string,
    public previousHash: string,
    public data: Transaction[],
    public difficulty: number,
    public nonce: number
  ) {}

  public static from(
    index: number,
    previousHash: string,
    timestamp: number,
    data: Transaction[],
    difficulty: number,
    nonce: number
  ): Block {
    const hash = CrytoUtil.calculateHash(index, previousHash, timestamp, data, difficulty, nonce);

    return new Block(index, timestamp, hash, previousHash, data, difficulty, nonce);
  }

  public static calculateHash(block: Block): string {
    return CrytoUtil.calculateHash(
      block.index,
      block.previousHash,
      block.timestamp,
      block.data,
      block.difficulty,
      block.nonce
    );
  }

  public static genesis(): Block {
    const index = 0;
    const previousHash = '';
    const data: Transaction[] = [];
    const timestamp = new Date().getTime() / 1000;
    const difficulty = 0;
    const nonce = 0;

    const hash = CrytoUtil.calculateHash(index, previousHash, timestamp, data, difficulty, nonce);

    return new Block(index, timestamp, hash, previousHash, data, difficulty, nonce);
  }

  public static mineBlock(
    index: number,
    previousHash: string,
    timestamp: number,
    data: Transaction[],
    difficulty: number
  ): Block {
    let nonce = 0;

    while (true) {
      const hash: string = CrytoUtil.calculateHash(index, previousHash, timestamp, data, difficulty, nonce);
      if (Block.hashMatchsDifficulty(hash, difficulty)) {
        return Block.from(index, previousHash, timestamp, data, difficulty, nonce);
      }
      nonce++;
    }
  }

  public static hashMatchsDifficulty(hash: string, difficulty: number): boolean {
    const hashInBinary: string = hexToBinary(hash);
    const requiredPrefix: string = '0'.repeat(difficulty);

    return hashInBinary.startsWith(requiredPrefix);
  }

  public static isValidTimestamp(block: Block, previousBlock: Block): boolean {
    return block.timestamp - previousBlock.timestamp >= 0 && new Date().getTime() / 1000 - block.timestamp >= 0;
  }

  public static isValidBlockStructure(block: Block): boolean {
    return (
      typeof block.index === 'number' &&
      typeof block.hash === 'string' &&
      typeof block.previousHash === 'string' &&
      typeof block.data === 'object' &&
      typeof block.difficulty === 'number' &&
      typeof block.nonce === 'number'
    );
  }

  public static isValidBlock(block: Block, previousBlock: Block): boolean {
    if (!this.isValidBlockStructure(block)) {
      console.log('invalid block structure');
      return false;
    }

    if (previousBlock.index + 1 !== block.index) {
      console.log('invalid index');
      return false;
    }

    if (previousBlock.hash !== block.previousHash) {
      console.log('invalid previous hash');
      return false;
    }

    if (!Block.hasValidHash(block)) {
      console.log('invalid hash');
      return false;
    }

    if (!Block.isValidTimestamp(block, previousBlock)) {
      console.log('invalid timestamp');
      return false;
    }

    return true;
  }

  public static hasValidHash(block: Block): boolean {
    if (block.hash !== Block.calculateHash(block)) {
      console.log('invalid hash');
      return false;
    }

    if (!Block.hashMatchsDifficulty(block.hash, block.difficulty)) {
      console.log('invalid difficulty');
      return false;
    }

    return true;
  }
}
