import { Block } from '@node-process/models/block.model';
import { Blockchain, BlockchainUtil } from '@node-process/models/blockchain.model';
import { Transaction } from '@node-process/models/transaction.model';
import { Database } from '@node-process/repos/database';
import { TransactionPoolRepo } from '@node-process/repos/transaction-pool.repo';
import { TransactionRepo } from '@node-process/repos/transaction.repo';
import { UnspentTxOutRepo } from '@node-process/repos/unspent-tx-out.repo';
import { BlockValidator } from '@node-process/validators/block.validator';
import { BlockchainValidator } from '@node-process/validators/blockchain.validator';
import { EmptyChainError } from '@shared/errors/empty-chain.error';
import { InvalidBlock } from '@shared/errors/invalid-block.error';
import { InvalidReplaceChain } from '@shared/errors/invalid-replace-chain.error';

export class BlockchainRepo {
  /**
   * @description - Gets the blockchain
   *
   * @returns Promise<Blockchain>
   */
  public static async get(): Promise<Blockchain> {
    return Database.BlockchainDB;
  }

  /**
   * @description - Gets the latest block
   *
   * @returns Promise<Block|null>
   */
  public static async getLatestBlock(): Promise<Block | null> {
    return Database.BlockchainDB.getLatestBlock();
  }

  /**
   * @description - Gets the block by hash
   *
   * @param hash
   *
   * @returns Promise<Block|undefined>
   */
  public static async getByHash(hash: string): Promise<Block | undefined> {
    return Database.BlockchainDB.chain.find(block => block.hash === hash);
  }

  /**
   * @description - Adds a new block from transactions to the blockchain. Transactions have coinbase transaction.
   *
   * @param data
   *
   * @returns Promise<Block>
   *
   * @throws EmptyChainError
   * @throws InvalidBlock
   */
  public static async addFromTransaction(data: Transaction[]): Promise<Block> {
    const blockchainDB = Database.BlockchainDB;

    const block = blockchainDB.generateNextBlockFromTransactions(data);

    return BlockchainRepo.add(block);
  }

  /**
   * @description - Adds a new block to the blockchain. Having update unspent transaction outputs and transaction pool.
   *
   * @param block
   *
   * @returns Promise<Block>
   *
   * @throws EmptyChainError
   * @throws InvalidBlock
   */
  public static async add(block: Block): Promise<Block> {
    const blockchainDB = Database.BlockchainDB;
    if (!blockchainDB.getLatestBlock()) {
      throw new EmptyChainError();
    }

    if (BlockValidator.validate(block, blockchainDB.getLatestBlock()!)) {
      await TransactionRepo.processTransactions(block.data, block.index);

      Database.BlockchainDB.chain.push(block);

      await UnspentTxOutRepo.update(block.data);

      await TransactionPoolRepo.update(Database.UnspentTxOutsDB);

      return block;
    }

    throw new InvalidBlock();
  }

  /**
   * @description - Replaces the blockchain with a new one that has larger accumulated difficulty
   *
   * @param newChain
   *
   * @returns Promise<void>
   *
   * @throws InvalidReplaceChain
   */
  public static async updateChain(newChain: Block[]): Promise<void> {
    if (
      !BlockchainValidator.validateChain(newChain) &&
      BlockchainUtil.calculateAccumulatedDifficulty(newChain) > BlockchainUtil.calculateAccumulatedDifficulty(Database.BlockchainDB.chain)
    ) {
      Database.BlockchainDB.chain = newChain;
      return;
    }

    throw new InvalidReplaceChain();
  }
}
