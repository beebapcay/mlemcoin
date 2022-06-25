import { Block, BlockUtil } from '@models/block.model';
import { InvalidGeneris } from '@shared/errors';
import { ErrorUtil } from '@utils/error.util';
import { BlockValidator } from '@validators/block.validator';

export class BlockchainValidator {
  /**
   * @description - Validate chain in the blockchain
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