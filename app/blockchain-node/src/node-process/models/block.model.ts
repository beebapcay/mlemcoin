import { Transaction } from '@node-process/models/transaction.model';
import { EncryptUtil } from '@node-process/utils/encrypt.util';
import { ObjectUtil } from '@shared/utils/object.util';

export interface IBlock {
  index: number;
  timestamp: number;
  hash: string;
  previousHash: string;
  data: Transaction[];
  difficulty: number;
  nonce: number;
}

export class Block extends ObjectUtil.autoImplement<IBlock>() {
  constructor(blockShape: IBlock) {
    super();
    this.index = blockShape.index;
    this.timestamp = blockShape.timestamp;
    this.hash = blockShape.hash;
    this.previousHash = blockShape.previousHash;
    this.data = blockShape.data;
    this.difficulty = blockShape.difficulty;
    this.nonce = blockShape.nonce;
  }

  /**
   * @description - Generates a block and calculate the hash inside
   *
   * @param index
   * @param timestamp
   * @param previousHash
   * @param data
   * @param difficulty
   * @param nonce
   *
   * @returns Block
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
    return new Block({ index, timestamp, hash, previousHash, data, difficulty, nonce });
  }
}

export class BlockUtil {
  /**
   * @description - Calculates the current timestamp in seconds
   *
   * @returns number
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
   *
   * @returns string
   */
  public static calculateHash(
    index: number,
    timestamp: number,
    previousHash: string,
    data: Transaction[],
    difficulty: number,
    nonce: number
  ): string {
    return EncryptUtil.calculateHash(index, timestamp, previousHash, data, difficulty, nonce);
  }

  /**
   * @description - Calculates the hash of a block
   *
   * @param block
   *
   * @returns string
   */
  public static calculateHashFromBlock(block: Block): string {
    return EncryptUtil.calculateHashFromObject<Block>(block, ['hash']);
  }
}
