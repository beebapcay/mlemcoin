import { Block, BlockUtil } from '@node-process/models/block.model';
import { BlockValidator } from '@node-process/validators/block.validator';
import { InvalidGeneris } from '@shared/errors/invalid-generis.error';
import { ErrorUtil } from '@shared/utils/error.util';


export class BlockchainValidator {
  /**
   * @description - Validates chain in the blockchain
   *
   * @param chain
   */
  public static validateChain(chain: Block[]): boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(BlockUtil.createGenesis())) {
      ErrorUtil.pError(new InvalidGeneris());
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      if (!BlockValidator.validate(chain[i], chain[i - 1])) {
        ErrorUtil.pError(new Error('Invalid block'));
        return false;
      }
    }

    return true;
  }
}