import { BlockchainRepo } from '@node-process/repos/blockchain.repo';
import { TransactionPoolRepo } from '@node-process/repos/transaction-pool.repo';
import { WalletRepo } from '@node-process/repos/wallet.repo';
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

    res.status(StatusCodes.OK).json(block);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {get} Mine new block. Get all transaction in transaction pool for mining.
 */
router.post(paths.mineNewBlock, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockchain = await BlockchainRepo.get();

    const publicKey = await WalletRepo.getPublicKey();

    const transactionPool = await TransactionPoolRepo.get();

    const rawBlock = blockchain.generateNextBlock(publicKey, transactionPool.transactions);

    const block = await BlockchainRepo.add(rawBlock);

    res.status(StatusCodes.OK).json(block);
  } catch (err) {
    next(err);
  }
});
