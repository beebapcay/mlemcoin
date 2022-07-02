import { ConfigurationConstants } from '@node-process/constants/config.constant';
import { Transaction, TransactionUtil } from '@node-process/models/transaction.model';
import { EncryptUtil } from '@node-process/utils/encrypt.util';
import { ObjectUtil } from '@shared/utils/object.util';

export interface IBlock {
  index: number;
  timestamp: number;
  hash: string;
  previousHash: string;
  data: Transaction[];
  difficulty: number;
  nonce: number;
}

export class Block extends ObjectUtil.autoImplement<IBlock>() {
  constructor(blockShape: IBlock) {
    super();
  }

  /**
   * @description - Generates a block and calculate the hash inside
   *
   * @param index
   * @param timestamp
   * @param previousHash
   * @param data
   * @param difficulty
   * @param nonce
   *
   * @returns Block
   */
  public static from(
    index: number,
    timestamp: number,
    previousHash: string,
    data: Transaction[],
    difficulty: number,
    nonce: number
  ): Block {
    const hash = BlockUtil.calculateHash(index, timestamp, previousHash, data, difficulty, nonce);
    return new Block({ index, timestamp, hash, previousHash, data, difficulty, nonce });
  }
}

export class BlockUtil {
  /**
   * @description - Calculates the current timestamp in seconds
   *
   * @returns number
   */
  public static calculateTimestamp(): number {
    return new Date().getTime() / 1000;
  }

  /**
   * @description - Calculates the hash of a block from its properties
   *
   * @param index
   * @param timestamp
   * @param previousHash
   * @param data
   * @param difficulty
   * @param nonce
   *
   * @returns string
   */
  public static calculateHash(
    index: number,
    timestamp: number,
    previousHash: string,
    data: Transaction[],
    difficulty: number,
    nonce: number
  ): string {
    return EncryptUtil.calculateHash(index, timestamp, previousHash, data, difficulty, nonce);
  }

  /**
   * @description - Calculates the hash of a block
   *
   * @param block
   *
   * @returns string
   */
  public static calculateHashFromBlock(block: Block): string {
    return EncryptUtil.calculateHashFromObject<Block>(block, ['hash']);
  }

  /**
   * @description - Creates a genesis block. This block is the first block in the chain
   * Genesis block will add a large amount of coins to the starting address (probably the coin's creator)
   *
   * @returns Block
   */
  public static createGenesis(): Block {
    const createGenesisTransaction = (creatorAddress: string, amount: number): Transaction => {
      const transaction = new Transaction({
        txIns: [{ signature: '', txOutId: '', txOutIndex: 0 }],
        txOuts: [{ address: creatorAddress, amount }],
        id: ''
      });

      transaction.id = TransactionUtil.getTransactionId(transaction);
      return transaction;
    };

    const index = 0;
    const timestamp = BlockUtil.calculateTimestamp();
    const previousHash = '';
    const data = [createGenesisTransaction(ConfigurationConstants.CREATOR_ADDRESS, ConfigurationConstants.CREATOR_AWARD_AMOUNT)];
    const difficulty = 0;
    const nonce = 0;

    const hash = BlockUtil.calculateHash(index, timestamp, previousHash, data, difficulty, nonce);

    return new Block({ index, timestamp, hash, previousHash, data, difficulty, nonce });
  }
}
