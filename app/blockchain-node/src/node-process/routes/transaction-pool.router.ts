import { TransactionPoolRepo } from '@node-process/repos/transaction-pool.repo';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

export const router = Router();

const paths = {
  get: '/',
  getById: '/:id'
};

/**
 * @api {get} Gets the transaction pool
 */
router.get(paths.get, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactionPool = await TransactionPoolRepo.get();
    res.status(StatusCodes.OK).json(transactionPool);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {get} Gets a transaction by id from the transaction pool
 */
router.get(paths.getById, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await TransactionPoolRepo.getById(req.params.id);
    res.status(StatusCodes.OK).json(transaction);
  } catch (err) {
    next(err);
  }
});