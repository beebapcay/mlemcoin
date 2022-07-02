import { BlockUtil } from '@node-process/models/block.model';
import { Blockchain } from '@node-process/models/blockchain.model';

export const BlockchainDB = new Blockchain({ chain: [] });
BlockchainDB.chain = [];
BlockchainDB.chain.push(BlockUtil.createGenesis());