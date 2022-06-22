import { timeStamp } from 'console';
import { CrytoUtil } from '../utils/crypto.util';

export class Block {
  constructor(
    public index: number,
    public timestamp: number,
    public hash: string,
    public previousHash: string,
    public data: string
  ) {}

  public static from(index: number, previousHash: string, data: string): Block {
    const timestamp = new Date().getTime() / 1000;
    const hash = CrytoUtil.calculateHash(index, previousHash, timestamp, data);

    return new Block(index, timestamp, hash, previousHash, data);
  }

  public static calculateHash(block: Block): string {
    return CrytoUtil.calculateHash(block.index, block.previousHash, block.timestamp, block.data);
  }

  public static genesis(): Block {
    const index = 0;
    const previousHash = '';
    const data = 'Genesis block';
    const timestamp = new Date().getTime() / 1000;
    const hash = CrytoUtil.calculateHash(index, previousHash, timestamp, data);

    return new Block(index, timestamp, hash, previousHash, data);
  }

  public static isValidBlockStructure(block: Block): boolean {
    return (
      typeof block.index === 'number' &&
      typeof block.hash === 'string' &&
      typeof block.previousHash === 'string' &&
      typeof block.data === 'string'
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

    if (block.hash !== Block.calculateHash(block)) {
      console.log('invalid hash');
      return false;
    }

    return true;
  }
}
