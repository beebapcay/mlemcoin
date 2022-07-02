import { TransactionUtil } from '@node-process/models/transaction.model';
import { UnspentTxOut } from '@node-process/models/unspent-tx-out.model';
import { BlockchainDB } from '@node-process/repos/database/blockchain.db';

export const UnspentTxOutsDB: UnspentTxOut[] = TransactionUtil.processTransactions(BlockchainDB.chain[0].data, [], 0);