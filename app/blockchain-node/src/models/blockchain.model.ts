import { Block, BlockUtil } from '@models/block.model';
import { Miner } from '@models/miner.model';
import { Transaction } from '@models/transaction.model';
import { ConfigurationConstants } from '@shared/constants';

export class Blockchain {
  constructor(public chain: Block[]) {
  }

  /**
   * @description - Get the latest block in the chain
   */
  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  /**
   * @description - Generate a new block and mine it
   *
   * @param data
   */
  public generateNextBlock(data: Transaction[]): Block {
    const previousBlock: Block = this.getLatestBlock();

    const index: number = previousBlock.index + 1;
    const timestamp: number = BlockUtil.calculateTimestamp();
    const difficulty: number = BlockchainUtil.calculateDifficulty(this);

    return Miner.mine(index, timestamp, previousBlock.hash, data, difficulty);
  }
}

export class BlockchainUtil {
  /**
   * @description - Calculate the accumulated difficulty of the chain
   *
   * @param chain
   */
  public static calculateAccumulatedDifficulty(chain: Block[]): number {
    return chain
      .map((block) => block.difficulty)
      .map((difficulty) => Math.pow(2, difficulty))
      .reduce((a, b) => a + b);
  }

  /**
   * @description - Calculate the difficulty of the latest block and adjust it every interval
   *
   * @param blockchain
   */
  public static calculateDifficulty(blockchain: Blockchain): number {
    const latestBlock: Block = blockchain.getLatestBlock();

    if (latestBlock.index % ConfigurationConstants.DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
      return this.calculateAdjustedDifficulty(blockchain);
    } else {
      return latestBlock.difficulty;
    }
  }

  /**
   * @description - Calculate the adjusted difficulty of the latest block
   *
   * @param blockchain
   */
  public static calculateAdjustedDifficulty(blockchain: Blockchain): number {
    const prevAdjustmentBlock: Block = blockchain.chain[blockchain.chain.length - ConfigurationConstants.DIFFICULTY_ADJUSTMENT_INTERVAL];

    const timeExpected: number = ConfigurationConstants.BLOCK_GENERATION_INTERVAL * ConfigurationConstants.DIFFICULTY_ADJUSTMENT_INTERVAL;
    const timeTaken: number = blockchain.getLatestBlock().timestamp - prevAdjustmentBlock.timestamp;

    if (timeTaken < timeExpected / 2) {
      return prevAdjustmentBlock.difficulty + 1;
    } else if (timeTaken > timeExpected * 2) {
      return prevAdjustmentBlock.difficulty - 1;
    } else {
      return prevAdjustmentBlock.difficulty;
    }
  }
}