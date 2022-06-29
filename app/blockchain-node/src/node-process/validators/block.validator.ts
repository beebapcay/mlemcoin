import { ConfigurationConstants } from '@node-process/constants/config.constant';
import { Block, BlockUtil } from '@node-process/models/block.model';
import { HashNotMatchDifficulty, InvalidHash } from '@shared/errors';
import { ErrorUtil } from '@shared/utils/error.util';
import { StringUtil } from '@shared/utils/string.util';

// noinspection SuspiciousTypeOfGuard
export class BlockValidator {
  /**
   * @description - Validates a block and its structure
   *
   * @param block
   * @param previousBlock
   */
  public static validate(block: Block, previousBlock: Block): boolean {
    if (!BlockValidator.validateStructure(block) || !BlockValidator.validateStructure(previousBlock)) {
      ErrorUtil.pError(new Error('Invalid block structure'));
      return false;
    }

    if (previousBlock.index + 1 !== block.index) {
      ErrorUtil.pError(new Error('Invalid block index. Expected: ' + (previousBlock.index + 1) + '. Actual: ' + block.index));
      return false;
    }

    if (previousBlock.hash !== block.previousHash) {
      ErrorUtil.pError(new Error('Invalid block previousHash. Expected: ' + previousBlock.hash + '. Actual: ' + block.previousHash));
      return false;
    }

    if (!BlockValidator.validateHash(block)) {
      ErrorUtil.pError(new InvalidHash());
      return false;
    }

    if (!BlockValidator.validateTimestamp(block, previousBlock)) {
      ErrorUtil.pError(new Error('Invalid block timestamp'));
      return false;
    }

    return true;
  }

  /**
   * @description - Validates the timestamp of a block
   *
   * @param block
   * @param previousBlock
   */
  public static validateTimestamp(block: Block, previousBlock: Block): boolean {
    const nowTimestamp = BlockUtil.calculateTimestamp();

    return block.timestamp - previousBlock.timestamp >= ConfigurationConstants.TIMESTAMP_VALIDATION_FROM_PREVIOUS_BLOCKS
      && nowTimestamp - block.timestamp >= ConfigurationConstants.TIMESTAMP_VALIDATION_FROM_NOW;
  }

  /**
   * @description - Validates the hash of a block matches the difficulty
   *
   * @param hash
   * @param difficulty
   */
  public static validateHashMatchDifficulty(hash: string, difficulty: number): boolean {
    const hashInBinary: string = StringUtil.hexToBinary(hash);
    const requiredPrefix: string = '0'.repeat(difficulty);

    return hashInBinary.startsWith(requiredPrefix);
  }

  /**
   * @description - Validates the structure of a block
   *
   * @param block
   */
  public static validateStructure(block: Block): boolean {
    if (typeof block.index !== 'number') {
      ErrorUtil.pError(new Error('Invalid block index type'));
      return false;
    }

    if (typeof block.timestamp !== 'number') {
      ErrorUtil.pError(new Error('Invalid block timestamp type'));
      return false;
    }

    if (typeof block.hash !== 'string') {
      ErrorUtil.pError(new Error('Invalid block hash type'));
      return false;
    }

    if (typeof block.previousHash !== 'string') {
      ErrorUtil.pError(new Error('Invalid block previousHash type'));
      return false;
    }

    if (!(block.data instanceof Array)) {
      ErrorUtil.pError(new Error('Invalid block data type'));
      return false;
    }

    if (typeof block.difficulty !== 'number') {
      ErrorUtil.pError(new Error('Invalid block difficulty type'));
      return false;
    }

    if (typeof block.nonce !== 'number') {
      ErrorUtil.pError(new Error('Invalid block nonce type'));
      return false;
    }

    return true;
  }

  /**
   * @description - Validates the hash of a block
   *
   * @param block
   */
  public static validateHash(block: Block): boolean {
    if (block.hash !== BlockUtil.calculateHashFromBlock(block)) {
      ErrorUtil.pError(new InvalidHash());
      return false;
    }

    if (!BlockValidator.validateHashMatchDifficulty(block.hash, block.difficulty)) {
      ErrorUtil.pError(new HashNotMatchDifficulty());
      return false;
    }

    return true;
  }
}