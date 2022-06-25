import { Block } from '@models/block.model';
import { Blockchain, BlockchainUtil } from '@models/blockchain.model';
import { UnspentTxOut } from '@models/unspent-tx-out.model';
import { TransactionRepo } from '@repos/transaction.repo';
import { InvalidBlock, InvalidReplaceChain } from "@shared/errors";
import { BlockValidator } from '@validators/block.validator';
import { BlockchainValidator } from '@validators/blockchain.validator';
import { ErrorUtil } from '@utils/error.util';
import { Database } from '@repos/database';

export class BlockchainRepo {
  /**
   * @description - Get the blockchain
   */
  public static async get(): Promise<Blockchain> {
    return Database.BlockchainDB;
  }

  /**
   * @description - Add a new block to the blockchain
   *
   * @param block
   */
  public async add(block: Block): Promise<UnspentTxOut[]> {
    const blockchainDB = Database.BlockchainDB;

    if (BlockValidator.validate(block, blockchainDB.getLatestBlock())) {
      const resultingProcessTransaction: UnspentTxOut[] = await TransactionRepo.processTransactions(block.data, block.index);

      Database.BlockchainDB.chain.push(block);
      Database.UnspentTxOutsDB = resultingProcessTransaction;

      return resultingProcessTransaction;
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