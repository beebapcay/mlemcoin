import { Wallet } from '@node-process/models/wallet.model';
import { BlockchainRepo } from '@node-process/repos/blockchain.repo';
import { WalletRepo } from '@node-process/repos/wallet.repo';
import { DataNotFound } from '@shared/errors/data-not-found.error';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as _ from 'lodash';

export const router = Router();

const paths = {
  get: '/',
  init: '/init',
  address: '/address',
  balance: '/balance/:address',
  delete: '/'
};

/**
 * @api {get} Initialize wallet and add dummy default COINBASE to it (if not exists)
 */
router.post(paths.init, async (_: Request, res: Response, next: NextFunction) => {
  try {
    const result = await WalletRepo.init();
    if (!result) {
      res.status(StatusCodes.CONFLICT).send(new Error('Wallet already exists or Could not create wallet'));
    }

    // Create dummy wallet balance
    const blockchain = await BlockchainRepo.get();

    const publicKey = await WalletRepo.getPublicKey();

    const rawBlock = blockchain.generateNextBlock(publicKey, []);

    await BlockchainRepo.add(rawBlock);

    res.status(StatusCodes.CREATED).send('Wallet created');
  } catch (error) {
    next(error);
  }
});

/**
 * @api {get} Get wallet address
 */
router.get(paths.address, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const publicKey = await WalletRepo.getPublicKey();
    if (!publicKey) {
      next(new DataNotFound(Wallet.name));
    }
    res.status(StatusCodes.OK).json(publicKey);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {get} Get wallet balance for given address. If address is not provided, it will return the balance of the wallet
 */
router.get(paths.balance, async (req: Request, res: Response, next: NextFunction) => {
  try {
    let address = req.params.address;
    if (!address || _.isEmpty(address)) {
      address = await WalletRepo.getPublicKey();
    }
    const balance = await WalletRepo.getBalance(address);
    res.status(StatusCodes.OK).json(balance);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {get} Get all information about the wallet. Remove this route in production
 */
router.get(paths.get, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wallet = await WalletRepo.get();
    if (!wallet) {
      next(new DataNotFound(Wallet.name));
    }
    res.status(StatusCodes.OK).json(wallet);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {delete} Delete wallet
 */
router.delete(paths.delete, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await WalletRepo.delete();
    if (!result) {
      next(new Error("Could not delete wallet"));
    }
    res.status(StatusCodes.OK).send("Wallet deleted");
  } catch (error) {
    next(error);
  }
});

