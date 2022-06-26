import { Block } from "@models/block.model";
import { Blockchain, BlockchainUtil } from "@models/blockchain.model";
import { Transaction } from "@models/transaction.model";
import { UnspentTxOut } from "@models/unspent-tx-out.model";
import { Database } from "@repos/database";
import { TransactionPoolRepo } from "@repos/transaction-pool.repo";
import { TransactionRepo } from "@repos/transaction.repo";
import { InvalidBlock, InvalidReplaceChain } from "@shared/errors";
import { ErrorUtil } from "@utils/error.util";
import { BlockValidator } from "@validators/block.validator";
import { BlockchainValidator } from "@validators/blockchain.validator";

export class BlockchainRepo {
  /**
   * @description - Get the blockchain
   */
  public static async get(): Promise<Blockchain> {
    return Database.BlockchainDB;
  }

  /**
   * @description - Get the block by hash
   *
   * @param hash
   */
  public static async getByHash(hash: string): Promise<Block | undefined> {
    return Database.BlockchainDB.chain.find(block => block.hash === hash);
  }

  /**
   * @description - Add a new block from transactions to the blockchain
   *
   * @param data
   */
  public static async addFromTransaction(data: Transaction[]): Promise<Block> {
    const blockchainDB = Database.BlockchainDB;

    const block = blockchainDB.generateNextBlockFromTransactions(data);

    return BlockchainRepo.add(block);
  }

  /**
   * @description - Add a new block to the blockchain
   *
   * @param block
   */
  public static async add(block: Block): Promise<Block> {
    const blockchainDB = Database.BlockchainDB;

    if (BlockValidator.validate(block, blockchainDB.getLatestBlock())) {
      const resultingProcessUnspentTxOuts: UnspentTxOut[] = await TransactionRepo.processTransactions(block.data, block.index);

      Database.BlockchainDB.chain.push(block);
      Database.UnspentTxOutsDB = resultingProcessUnspentTxOuts;

      TransactionPoolRepo.update(Database.UnspentTxOutsDB);

      return block;
    }

    throw new InvalidBlock();
  }

  /**
   * @description - Replace the blockchain with a new one
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