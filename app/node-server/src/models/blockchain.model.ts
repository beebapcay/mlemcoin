import { CrytoUtil } from '../utils/crypto.util';
import { Block } from './block.model';

export class Blockchain {
  constructor(public chain: Block[]) {}

  public getLastestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public generateNextBlock(data: string): Block {
    const previousBlock: Block = this.getLastestBlock();

    const index: number = previousBlock.index + 1;

    const newBlock = Block.from(index, previousBlock.hash, data);

    return newBlock;
  }

  public addBlock(block: Block): void {
    if (Block.isValidBlock(block, this.getLastestBlock())) {
      this.chain.push(block);
    }
  }

  public replaceChain(newChain: Block[]): void {
    if (!Blockchain.isValidChain(newChain) && newChain.length >= this.chain.length) {
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
}

export default new Blockchain([Block.genesis()]);
