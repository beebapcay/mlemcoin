import { BlockValidator } from '../validators/block.validator';
import { Block, BlockUtil } from './block.model';
import { Transaction } from './transaction.model';

export class Miner {
  /**
   * @description - Mine a new block
   *
   * @param index
   * @param timestamp
   * @param previousHash
   * @param data
   * @param difficulty
   */
  public static mine(
    index: number,
    timestamp: number,
    previousHash: string,
    data: Transaction[],
    difficulty: number
  ): Block {
    let nonce = 0;

    while (true) {
      const hash: string = BlockUtil.calculateHash(index, timestamp, previousHash, data, difficulty, nonce);
      if (BlockValidator.validateHashMatchDifficulty(hash, difficulty)) {
        return new Block(index, timestamp, hash, previousHash, data, difficulty, nonce);
      }
      nonce++;
    }
  }
}