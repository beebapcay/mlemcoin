import { Block, BlockUtil } from "@models/block.model";
import { Transaction } from "@models/transaction.model";
import { BlockValidator } from "@validators/block.validator";

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