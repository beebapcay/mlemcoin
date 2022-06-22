import { CrytoUtil } from '../utils/crypto.util';
import { Block } from './block.model';

const BLOCK_GENERATION_INTERVAL: number = 10;

const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10;

export class Blockchain {
  constructor(public chain: Block[]) {}

  public getLastestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public generateNextBlock(data: string): Block {
    const previousBlock: Block = this.getLastestBlock();

    const index: number = previousBlock.index + 1;

    console.log('previousBlock.index: ', previousBlock.index);

    const timestamp: number = new Date().getTime() / 1000;
    const difficulty: number = this.getDifficulty();

    const newBlock = Block.mineBlock(index, previousBlock.hash, timestamp, data, difficulty);

    return newBlock;
  }

  public addBlock(block: Block): boolean {
    if (Block.isValidBlock(block, this.getLastestBlock())) {
      this.chain.push(block);
      return true;
    }

    return false;
  }

  public getDifficulty(): number {
    const latestBlock: Block = this.getLastestBlock();

    if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
      return this.getAjustedDifficulty();
    } else {
      return latestBlock.difficulty;
    }
  }

  public getAjustedDifficulty(): number {
    const prevAdjustmentBlock: Block = this.chain[this.chain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    const timeExpected: number = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
    const timeTaken: number = this.getLastestBlock().timestamp - prevAdjustmentBlock.timestamp;

    if (timeTaken < timeExpected / 2) {
      return prevAdjustmentBlock.difficulty + 1;
    } else if (timeTaken > timeExpected * 2) {
      return prevAdjustmentBlock.difficulty - 1;
    } else {
      return prevAdjustmentBlock.difficulty;
    }
  }

  public replaceChain(newChain: Block[]): void {
    if (
      !Blockchain.isValidChain(newChain) &&
      Blockchain.getAccumulatedDifficulty(newChain) > Blockchain.getAccumulatedDifficulty(this.chain)
    ) {
      console.log('received chain is valid. replacing current chain with received chain');
      this.chain = newChain;
      return;
    }

    console.log('received chain is invalid. not replacing chain');
  }

  public static isValidChain(chain: Block[]): boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      console.log('invalid genesis block');
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      if (!Block.isValidBlock(chain[i], chain[i - 1])) {
        console.log('invalid block');
        return false;
      }
    }

    return true;
  }

  public static getAccumulatedDifficulty(chain: Block[]): number {
    return chain
      .map((block) => block.difficulty)
      .map((difficulty) => Math.pow(2, difficulty))
      .reduce((a, b) => a + b);
  }
}

export default new Blockchain([Block.genesis()]);
