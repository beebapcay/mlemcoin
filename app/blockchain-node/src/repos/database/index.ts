import { BlockUtil } from '@models/block.model';
import { Blockchain } from '@models/blockchain.model';
import { UnspentTxOut } from '@models/unspent-tx-out.model';

const blockchain = new Blockchain([BlockUtil.createGenesis()]);

const unspentTxOuts = [] as UnspentTxOut[];

export const DB = {
  blockchain,
  unspentTxOuts
}