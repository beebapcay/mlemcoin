import { ConfigurationConstants } from '@node-process/constants/config.constant';
import { Block, BlockUtil } from '@node-process/models/block.model';
import { Miner } from '@node-process/models/miner.model';
import { Transaction, TransactionUtil } from '@node-process/models/transaction.model';
import { EmptyChainError } from '@shared/errors/empty-chain.error';
import { ObjectUtil } from '@shared/utils/object.util';

export interface IBlockchain {
  chain: Block[];
}

export class Blockchain extends ObjectUtil.autoImplement<IBlockchain>() {
  constructor(blockchainShape: IBlockchain) {
    super();
  }

  /**
   * @description - Gets the latest block in the chain. Returns null if no blocks exist
   *
   * @returns Block
   */
  public getLatestBlock(): Block | null {
    return this.chain.length === 0 ? null : this.chain[this.chain.length - 1];
  }

  /**
   * @description - Generates a new block from transactions and start mining.
   * Transactions must have coinbase transaction.
   *
   * @param data
   *
   * @returns Block
   *
   * @throws EmptyChainError
   */
  public generateNextBlockFromTransactions(data: Transaction[]): Block {
    const previousBlock = this.getLatestBlock();
    if (!previousBlock) {
      throw new EmptyChainError();
    }

    const index: number = previousBlock.index + 1;
    const timestamp: number = BlockUtil.calculateTimestamp();
    const difficulty: number = BlockchainUtil.calculateDifficulty(this);

    return Miner.mine(index, timestamp, previousBlock.hash, data, difficulty);
  }

  /**
   * @description - Generates a new block from transactions and start mining.
   * Transactions is an array of transaction intended to be added and create to the block.
   * (not contains coinbase transaction)
   *
   * @param publicKey
   * @param txs
   *
   * @returns Block
   *
   * @throws EmptyChainError
   */
  public generateNextBlock(publicKey: string, txs: Transaction[]): Block {
    if (!this.getLatestBlock()) throw new EmptyChainError();
    const coinbaseTx = TransactionUtil.createCoinbaseTransaction(publicKey, this.getLatestBlock()!.index + 1);
    const blockData = [coinbaseTx].concat(txs);
    return this.generateNextBlockFromTransactions(blockData);
  }

  /**
   * @description - Generates a new block from transaction and start mining
   *
   * @param publicKey
   * @param transaction
   *
   * @returns Block
   *
   * @throws EmptyChainError
   */
  public generateNextBlockWithTransaction(publicKey: string, transaction: Transaction): Block {
    if (!this.getLatestBlock()) throw new EmptyChainError();
    const coinbaseTx = TransactionUtil.createCoinbaseTransaction(publicKey, this.getLatestBlock()!.index + 1);
    const blockData = [coinbaseTx, transaction];
    return this.generateNextBlockFromTransactions(blockData);
  }
}

export class BlockchainUtil {
  /**
   * @description - Calculates the accumulated difficulty of the chain
   *
   * @param chain
   *
   * @returns number
   */
  public static calculateAccumulatedDifficulty(chain: Block[]): number {
    return chain
      .map((block) => block.difficulty)
      .map((difficulty) => Math.pow(2, difficulty))
      .reduce((a, b) => a + b);
  }

  /**
   * @description - Calculates the difficulty of the latest block and adjust it every interval
   *
   * @param blockchain
   *
   * @returns number
   *
   * @throws EmptyChainError
   */
  public static calculateDifficulty(blockchain: Blockchain): number {
    const latestBlock = blockchain.getLatestBlock();
    if (!latestBlock) {
      throw new EmptyChainError();
    }

    if (latestBlock.index % ConfigurationConstants.DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
      return this.calculateAdjustedDifficulty(blockchain);
    } else {
      return latestBlock.difficulty;
    }
  }

  /**
   * @description - Calculates the adjusted difficulty of the latest block
   *
   * @param blockchain
   *
   * @returns number
   */
  public static calculateAdjustedDifficulty(blockchain: Blockchain): number {
    const prevAdjustmentBlock: Block = blockchain.chain[blockchain.chain.length - ConfigurationConstants.DIFFICULTY_ADJUSTMENT_INTERVAL];

    const timeExpected: number = ConfigurationConstants.BLOCK_GENERATION_INTERVAL * ConfigurationConstants.DIFFICULTY_ADJUSTMENT_INTERVAL;
    const timeTaken: number = blockchain.getLatestBlock()!.timestamp - prevAdjustmentBlock.timestamp;

    if (timeTaken < timeExpected / 2) {
      return prevAdjustmentBlock.difficulty + 1;
    } else if (timeTaken > timeExpected * 2) {
      return prevAdjustmentBlock.difficulty - 1;
    } else {
      return prevAdjustmentBlock.difficulty;
    }
  }
}