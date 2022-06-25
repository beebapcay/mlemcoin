import { Block, BlockUtil } from '@models/block.model';
import { Transaction } from '@models/transaction.model';
import { BlockValidator } from '@validators/block.validator';

export class Miner {
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
        return Block.from(index, timestamp, hash, previousHash, data, difficulty, nonce);
      }
      nonce++;
    }
  }
}