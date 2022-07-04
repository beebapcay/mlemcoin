// noinspection DuplicatedCode

import { ObjectUtil } from '../utils/object.util';
import { Block } from './block.model';

export interface IBlockchain {
  chain: Block[];
}

export class Blockchain extends ObjectUtil.autoImplement<IBlockchain>() {
  constructor(blockchainShape: IBlockchain) {
    super();
    this.chain = blockchainShape.chain;
  }

  public getLatestBlock(): Block | null {
    return this.chain.length === 0 ? null : this.chain[this.chain.length - 1];
  }
}
