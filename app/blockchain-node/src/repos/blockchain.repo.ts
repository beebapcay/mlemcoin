import { Block } from '@models/block.model';
import { Blockchain, BlockchainUtil } from '@models/blockchain.model';
import { UnspentTxOut } from '@models/unspent-tx-out.model';
import { DB } from '@repos/database';
import { TransactionRepo } from '@repos/transaction.repo';
import { ErrorUtil } from '@utils/error.util';
import { BlockValidator } from '@validators/block.validator';
import { BlockchainValidator } from '@validators/blockchain.validator';

export class BlockchainRepo {
  /**
   * @description - Get the blockchain from DB
   */
  public static async get(): Promise<Blockchain> {
    return DB.blockchain;
  }

  /**
   * @description - Add a new block to the blockchain
   *
   * @param block
   */
  public async add(block: Block): Promise<UnspentTxOut[] | null> {
    if (BlockValidator.validate(block, DB.blockchain.getLatestBlock())) {
      const resultingProcessTransaction: UnspentTxOut[] = await TransactionRepo.processTransactions(block.data, block.index);

      DB.blockchain.chain.push(block);
      DB.unspentTxOuts = resultingProcessTransaction;

      return resultingProcessTransaction;
    }

    return null;
  }

  /**
   * @description - Replace the blockchain with a new one
   *
   * @param newChain
   */
  public async updateChain(newChain: Block[]): Promise<void> {
    if (
      !BlockchainValidator.validateChain(newChain) &&
      BlockchainUtil.calculateAccumulatedDifficulty(newChain) > BlockchainUtil.calculateAccumulatedDifficulty(DB.blockchain.chain)
    ) {
      DB.blockchain.chain = newChain;
      return;
    }

    ErrorUtil.pError(new Error('Invalid chain or not larger accumulated difficulty than current chain'));
  }
}