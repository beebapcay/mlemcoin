import { ConfigurationConstants } from '@node-process/constants/config.constant';
import { Block, BlockUtil } from '@node-process/models/block.model';
import { Miner } from '@node-process/models/miner.model';
import { Transaction, TransactionUtil } from '@node-process/models/transaction.model';
import { InterfaceUtil } from '@shared/utils/interface.util';

export interface IBlockchain {
  chain: Block[];
}

export class Blockchain extends InterfaceUtil.autoImplement<IBlockchain>() {
  constructor(blockchainShape: IBlockchain) {
    super();
  }

  /**
   * @description - Gets the latest block in the chain
   */
  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  /**
   * @description - Generates a new block from transactions and mining. Transactions have coinbase transaction
   *
   * @param data
   */
  public generateNextBlockFromTransactions(data: Transaction[]): Block {
    const previousBlock: Block = this.getLatestBlock();

    const index: number = previousBlock.index + 1;
    const timestamp: number = BlockUtil.calculateTimestamp();
    const difficulty: number = BlockchainUtil.calculateDifficulty(this);

    return Miner.mine(index, timestamp, previousBlock.hash, data, difficulty);
  }

  /**
   * @description - Generates a new block from transactions and mining. Transactions don't have coinbase transaction
   *
   * @param publicKey
   * @param txs
   */
  public generateNextBlock(publicKey: string, txs: Transaction[]) {
    const coinbaseTx = TransactionUtil.createCoinbaseTransaction(publicKey, this.getLatestBlock().index + 1);
    const blockData = [coinbaseTx].concat(txs);
    return this.generateNextBlockFromTransactions(blockData);
  }

  /**
   * @description - Generates a new block from transaction and mining
   *
   * @param publicKey
   * @param transaction
   */
  public generateNextBlockWithTransaction(publicKey: string, transaction: Transaction): Block {
    const coinbaseTx = TransactionUtil.createCoinbaseTransaction(publicKey, this.getLatestBlock().index + 1);
    const blockData = [coinbaseTx, transaction];
    return this.generateNextBlockFromTransactions(blockData);
  }
}

export class BlockchainUtil {
  /**
   * @description - Calculates the accumulated difficulty of the chain
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
   * @description - Calculates the difficulty of the latest block and adjust it every interval
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
   * @description - Calculates the adjusted difficulty of the latest block
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