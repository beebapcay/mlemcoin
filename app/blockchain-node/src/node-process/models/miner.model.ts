import { Block, BlockUtil } from '@node-process/models/block.model';
import { Transaction } from '@node-process/models/transaction.model';
import { BlockValidator } from '@node-process/validators/block.validator';

export class Miner {
  /**
   * @description - Mines nonce number for a block from a given block properties
   *
   * @param index
   * @param timestamp
   * @param previousHash
   * @param data
   * @param difficulty
   *
   * @returns Block
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
        return new Block({ index, timestamp, hash, previousHash, data, difficulty, nonce });
      }
      nonce++;
    }
  }
}