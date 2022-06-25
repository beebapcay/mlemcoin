import {BlockchainDB} from '@database/blockchain.db';
import {UnspentTxOutsDB} from "@database/unspent-tx-out.db";
import {TransactionPoolDB} from "@database/transaction-pool.db";

export const Database = {
  BlockchainDB,
  UnspentTxOutsDB,
  TransactionPoolDB
};