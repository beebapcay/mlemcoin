import { Transaction } from '@node-process/models/transaction.model';
import { EncryptUtil } from '@node-process/utils/encrypt.util';
import { InterfaceUtil } from '@shared/utils/interface.util';

export interface IBlock {
  index: number;
  timestamp: number;
  hash: string;
  previousHash: string;
  data: Transaction[];
  difficulty: number;
  nonce: number;
}

export class Block extends InterfaceUtil.autoImplement<IBlock>() {
  constructor(blockShape: IBlock) {
    super();
  }

  /**
   * @description - Generates a block and calculate the hash
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
    return new Block({ index, timestamp, hash, previousHash, data, difficulty, nonce });
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
    const timestamp = BlockUtil.calculateTimestamp();
    const previousHash = '';
    const data = [];
    const difficulty = 0;
    const nonce = 0;

    const hash = BlockUtil.calculateHash(index, timestamp, previousHash, data, difficulty, nonce);

    return new Block({ index, timestamp, hash, previousHash, data, difficulty, nonce });
  }
}
