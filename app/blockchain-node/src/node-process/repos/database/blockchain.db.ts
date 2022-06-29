import { BlockUtil } from '../../models/block.model';
import { Blockchain } from '../../models/blockchain.model';

export const BlockchainDB = new Blockchain([]);
BlockchainDB.chain.push(BlockUtil.createGenesis());