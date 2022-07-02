import { Blockchain, BlockchainUtil } from '@node-process/models/blockchain.model';

export const BlockchainDB = new Blockchain({ chain: [] });
BlockchainDB.chain.push(BlockchainUtil.createGenesis());