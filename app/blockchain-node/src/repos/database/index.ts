import { BlockUtil } from '@models/block.model';
import { Blockchain } from '@models/blockchain.model';
import { TransactionPool } from '@models/transaction-pool.model';
import { UnspentTxOut } from '@models/unspent-tx-out.model';

const blockchain = new Blockchain([BlockUtil.createGenesis()]);

const unspentTxOuts = [] as UnspentTxOut[];

const transactionPool = new TransactionPool([]);

export const DB = {
  blockchain,
  unspentTxOuts,
  transactionPool
}