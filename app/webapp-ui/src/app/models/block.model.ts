// noinspection DuplicatedCode

import { ObjectUtil } from '../utils/object.util';
import { Transaction } from './transaction.model';

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
    this.index = blockShape.index;
    this.timestamp = blockShape.timestamp;
    this.hash = blockShape.hash;
    this.previousHash = blockShape.previousHash;
    this.data = blockShape.data;
    this.difficulty = blockShape.difficulty;
    this.nonce = blockShape.nonce;
  }
}
