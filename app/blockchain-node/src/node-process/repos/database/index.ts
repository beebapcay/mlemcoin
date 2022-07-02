import { BlockchainDB } from '@node-process/repos/database/blockchain.db';
import { TransactionPoolDB } from '@node-process/repos/database/transaction-pool.db';
import { UnspentTxOutsDB } from '@node-process/repos/database/unspent-tx-out.db';

// The database is a singleton class that is used to store the blockchain and the transaction pool.
// Constantly being updated by p2p processes.
export const Database = {
  BlockchainDB,
  UnspentTxOutsDB,
  TransactionPoolDB
};