import { Router } from 'express';
import { router as blockchainRouter } from './blockchain.router';
import { router as minerRouter } from './miner.router';
import { router as transactionPoolRouter } from './transaction-pool.router';
import { router as transactionRouter } from './transaction.router';
import { router as unspentTxOutRouter } from './unspent-tx-out.router';
import { router as walletRouter } from './wallet.router';

export const apiRouter = Router();

apiRouter.use('/blockchain', blockchainRouter);

apiRouter.use('/transactions', transactionRouter);

apiRouter.use('/wallet', walletRouter);

apiRouter.use('/unspent-tx-outs', unspentTxOutRouter);

apiRouter.use("/miner", minerRouter);

apiRouter.use("/transaction-pool", transactionPoolRouter);