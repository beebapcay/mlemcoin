import { Block } from '@node-process/models/block.model';
import { Blockchain, BlockchainUtil } from '@node-process/models/blockchain.model';
import { Transaction } from '@node-process/models/transaction.model';
import { UnspentTxOut } from '@node-process/models/unspent-tx-out.model';
import { Database } from '@node-process/repos/database';
import { TransactionPoolRepo } from '@node-process/repos/transaction-pool.repo';
import { TransactionRepo } from '@node-process/repos/transaction.repo';
import { BlockValidator } from '@node-process/validators/block.validator';
import { BlockchainValidator } from '@node-process/validators/blockchain.validator';
import { InvalidBlock, InvalidReplaceChain } from '@shared/errors';
import { ErrorUtil } from '@shared/utils/error.util';

export class BlockchainRepo {
  /**
   * @description - Gets the blockchain
   */
  public static async get(): Promise<Blockchain> {
    return Database.BlockchainDB;
  }

  /**
   * @description - Gets the block by hash
   *
   * @param hash
   */
  public static async getByHash(hash: string): Promise<Block | undefined> {
    return Database.BlockchainDB.chain.find(block => block.hash === hash);
  }

  /**
   * @description - Adds a new block from transactions to the blockchain. Transactions have coinbase transaction
   *
   * @param data
   */
  public static async addFromTransaction(data: Transaction[]): Promise<Block> {
    const blockchainDB = Database.BlockchainDB;

    const block = blockchainDB.generateNextBlockFromTransactions(data);

    return BlockchainRepo.add(block);
  }

  /**
   * @description - Adds a new block to the blockchain. Having update unspent transaction outputs and transaction pool
   *
   * @param block
   */
  public static async add(block: Block): Promise<Block> {
    const blockchainDB = Database.BlockchainDB;

    if (BlockValidator.validate(block, blockchainDB.getLatestBlock())) {
      const resultingProcessUnspentTxOuts: UnspentTxOut[] = await TransactionRepo.processTransactions(block.data, block.index);

      Database.BlockchainDB.chain.push(block);
      Database.UnspentTxOutsDB = resultingProcessUnspentTxOuts;

      await TransactionPoolRepo.update(Database.UnspentTxOutsDB);

      return block;
    }

    throw new InvalidBlock();
  }

  /**
   * @description - Replaces the blockchain with a new one that has larger accumulated difficulty
   *
   * @param newChain
   */
  public async updateChain(newChain: Block[]): Promise<void> {
    if (
      !BlockchainValidator.validateChain(newChain) &&
      BlockchainUtil.calculateAccumulatedDifficulty(newChain) > BlockchainUtil.calculateAccumulatedDifficulty(Database.BlockchainDB.chain)
    ) {
      Database.BlockchainDB.chain = newChain;
      return;
    }

    ErrorUtil.pError(new InvalidReplaceChain());
  }
}