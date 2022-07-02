import { UnspentTxOutRepo } from '@node-process/repos/unspent-tx-out.repo';
import { WalletRepo } from '@node-process/repos/wallet.repo';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

export const router = Router();

export const paths = {
  get: '/',
  getByAddress: '/:address',
  getByMyAddress: '/my-address'
};

/**
 * @api {get} Gets all unspent transaction outputs
 */
router.get(paths.get, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(StatusCodes.OK).json(await UnspentTxOutRepo.getAll());
  } catch (err) {
    next(err);
  }
});

/**
 * @api {get} Gets all unspent transaction outputs by address
 */
router.get(paths.getByAddress, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(StatusCodes.OK).json(await UnspentTxOutRepo.getByAddress(req.params.address));
  } catch (err) {
    next(err);
  }
});

/**
 * @api {get} Gets all unspent transaction outputs by my address
 */
router.get(paths.getByMyAddress, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await WalletRepo.getPublicKey();
    res.status(StatusCodes.OK).json(await UnspentTxOutRepo.getByAddress(address));
  } catch (err) {
    next(err);
  }
});