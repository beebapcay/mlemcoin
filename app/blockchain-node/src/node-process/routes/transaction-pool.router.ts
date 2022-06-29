import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TransactionPoolRepo } from '../repos/transaction-pool.repo';

export const router = Router();

const paths = {
  get: '/',
  getById: '/:id'
};

router.get(paths.get, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactionPool = await TransactionPoolRepo.get();
    res.status(StatusCodes.OK).json(transactionPool);
  } catch (err) {
    next(err);
  }
});

router.get(paths.getById, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await TransactionPoolRepo.getById(req.params.id);
    res.status(StatusCodes.OK).json(transaction);
  } catch (err) {
    next(err);
  }
});