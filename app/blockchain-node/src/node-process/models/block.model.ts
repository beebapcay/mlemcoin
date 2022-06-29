import { EncryptUtil } from '@shared/utils/encrypt.util';
import { Transaction } from './transaction.model';

export class Block {
  constructor(
    public index: number,
    public timestamp: number,
    public hash: string,
    public previousHash: string,
    public data: Transaction[],
    public difficulty: number,
    public nonce: number
  ) {
  }

  /**
   * @description - Generate a block with creating hash
   *
   * @param index
   * @param timestamp
   * @param previousHash
   * @param data
   * @param difficulty
   * @param nonce
   */
  public static from(
    index: number,
    timestamp: number,
    previousHash: string,
    data: Transaction[],
    difficulty: number,
    nonce: number
  ): Block {
    const hash = BlockUtil.calculateHash(index, timestamp, previousHash, data, difficulty, nonce);
    return new Block(index, timestamp, hash, previousHash, data, difficulty, nonce);
  }
}

export class BlockUtil {
  /**
   * @description - Calculates the current timestamp in seconds
   */
  public static calculateTimestamp(): number {
    return new Date().getTime() / 1000;
  }

  /**
   * @description - Calculates the hash of a block from its properties
   *
   * @param index
   * @param timestamp
   * @param previousHash
   * @param data
   * @param difficulty
   * @param nonce
   */
  public static calculateHash(
    index: number,
    timestamp: number,
    previousHash: string,
    data: Transaction[],
    difficulty: number,
    nonce: number
  ) {
    return EncryptUtil.calculateHash(index, timestamp, previousHash, data, difficulty, nonce);
  }

  /**
   * @description - Calculates the hash of a block
   *
   * @param block
   */
  public static calculateHashFromBlock(block: Block): string {
    return EncryptUtil.calculateHashFromObject<Block>(block, ['hash']);
  }

  /**
   * @description - Creates a genesis block
   */
  public static createGenesis(): Block {
    const index = 0;
    const previousHash = '';
    const data = [];
    const timestamp = BlockUtil.calculateTimestamp();
    const difficulty = 0;
    const nonce = 0;

    const hash = BlockUtil.calculateHash(index, timestamp, previousHash, data, difficulty, nonce);

    return new Block(index, timestamp, hash, previousHash, data, difficulty, nonce);
  }
}
