import { BlockchainRepo } from '@node-process/repos/blockchain.repo';
import { TransactionPoolRepo } from '@node-process/repos/transaction-pool.repo';
import { WalletRepo } from '@node-process/repos/wallet.repo';
import { P2PHandler } from '@p2p-process/handler/p2p.handler';
import { ResponseHandler } from '@p2p-process/handler/response.handler';
import { ParamMissingError } from '@shared/errors/param-missing.error';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

export const router = Router();

const paths = {
  mineNewBlock: '/new-block',
  mineTransaction: '/transaction'
};

/**
 * @api {get} Mine new block with transactions. Transactions have coinbase transaction.
 */
router.post(paths.mineTransaction, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.data) {
      next(new ParamMissingError());
    }

    const block = await BlockchainRepo.addFromTransactionsData(req.body.data);

    P2PHandler.broadcast(ResponseHandler.responseLatestBlock(await BlockchainRepo.getLatestBlock()));

    res.status(StatusCodes.OK).json(block);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {get} Mine new block. Get all transaction in transaction pool for mining.
 * TODO: Change logic to only mining a transaction with largest amount.
 */
router.post(paths.mineNewBlock, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockchain = await BlockchainRepo.get();

    const publicKey = await WalletRepo.getPublicKey();

    const transactionPool = await TransactionPoolRepo.get();

    const rawBlock = blockchain.generateNextBlock(publicKey, transactionPool.transactions);

    const block = await BlockchainRepo.add(rawBlock);

    P2PHandler.broadcast(ResponseHandler.responseLatestBlock(await BlockchainRepo.getLatestBlock()));

    res.status(StatusCodes.OK).json(block);
  } catch (err) {
    next(err);
  }
});
