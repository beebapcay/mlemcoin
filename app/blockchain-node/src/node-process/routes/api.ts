import { router as blockchainRouter } from '@node-process/routes/blockchain.router';
import { router as minerRouter } from '@node-process/routes/miner.router';
import { router as transactionPoolRouter } from '@node-process/routes/transaction-pool.router';
import { router as transactionRouter } from '@node-process/routes/transaction.router';
import { router as unspentTxOutRouter } from '@node-process/routes/unspent-tx-out.router';
import { router as walletRouter } from '@node-process/routes/wallet.router';
import { Router } from 'express';

export const apiRouter = Router();

apiRouter.use('/blockchain', blockchainRouter);

apiRouter.use('/transactions', transactionRouter);

apiRouter.use('/wallet', walletRouter);

apiRouter.use('/unspent-tx-outs', unspentTxOutRouter);

apiRouter.use("/miner", minerRouter);

apiRouter.use("/transaction-pool", transactionPoolRouter);