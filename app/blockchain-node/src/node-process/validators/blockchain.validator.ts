import { Block } from '@node-process/models/block.model';
import { BlockchainUtil } from '@node-process/models/blockchain.model';
import { TransactionUtil } from '@node-process/models/transaction.model';
import { UnspentTxOut } from '@node-process/models/unspent-tx-out.model';
import { BlockValidator } from '@node-process/validators/block.validator';
import { InvalidGeneris } from '@shared/errors/invalid-generis.error';
import { ErrorUtil } from '@shared/utils/error.util';


export class BlockchainValidator {
  /**
   * @description - Validates chain in the blockchain. Return unspent transaction outputs if valid.
   *
   * @param chain
   *
   * @returns UnspentTxOut[]
   */
  public static validateChain(chain: Block[]): UnspentTxOut[] | null {
    if (JSON.stringify(chain[0]) !== JSON.stringify(BlockchainUtil.createGenesis())) {
      ErrorUtil.pError(new InvalidGeneris());
      return null;
    }

    // Validate each block in the chain.
    // The block is valid if the block data validation (hash and timestamp) and structure is valid
    // Also the transactions must be valid.

    let aUnspentTxOuts: UnspentTxOut[] = [];

    for (let i = 1; i < chain.length; i++) {
      const previousBlock = chain[i - 1];
      const currentBlock = chain[i];

      if (!BlockValidator.validate(currentBlock, previousBlock)) {
        ErrorUtil.pError(new Error('Invalid block'));
        return null;
      }

      aUnspentTxOuts = TransactionUtil.processTransactions(currentBlock.data, aUnspentTxOuts, currentBlock.index);

      if (!aUnspentTxOuts) {
        ErrorUtil.pError(new Error('Some block have wrong transactions'));
        return null;
      }

    }

    return aUnspentTxOuts;
  }
}