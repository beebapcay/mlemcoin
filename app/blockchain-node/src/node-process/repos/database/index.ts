import { BlockchainDB } from '@node-process/repos/database/blockchain.db';
import { TransactionPoolDB } from '@node-process/repos/database/transaction-pool.db';
import { UnspentTxOutsDB } from '@node-process/repos/database/unspent-tx-out.db';


export const Database = {
  BlockchainDB,
  UnspentTxOutsDB,
  TransactionPoolDB
};