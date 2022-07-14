import { TransactionUtil } from '@node-process/models/transaction.model';
import { Wallet, WalletUtil } from '@node-process/models/wallet.model';
import { BlockchainRepo } from '@node-process/repos/blockchain.repo';
import { TransactionPoolRepo } from '@node-process/repos/transaction-pool.repo';
import { UnspentTxOutRepo } from '@node-process/repos/unspent-tx-out.repo';
import { WalletRepo } from '@node-process/repos/wallet.repo';
import { WalletValidator } from '@node-process/validators/wallet.validator';
import { DataNotFound } from '@shared/errors/data-not-found.error';
import { ParamMissingError } from '@shared/errors/param-missing.error';
import { ParamsValueError } from '@shared/errors/params-value.errors';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as _ from 'lodash';

export const router = Router();

const paths = {
  tracker: '/tracker',
  generatePrivateKey: '/generate-private-key',
  connect: '/connect',
  disconnect: '/disconnect',
  get: '/',
  address: '/address',
  balance: '/balance/:address'
};

/**
 * @api {get} Get all wallet info from blockchain
 */
router.get(paths.tracker, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockchain = await BlockchainRepo.get();
    const transaction = _.flatten(blockchain.chain.map(block => block.data));
    const txOuts = _.flatten(transaction.map(tx => tx.txOuts));

    const publicKeys = txOuts.map(txOut => txOut.address).filter((v, i, a) => a.indexOf(v) === i);

    const wallets: Wallet[] = [];

    for (const publicKey of publicKeys) {
      const balance = await WalletRepo.getBalance(publicKey);
      const wallet = new Wallet({ publicKey: publicKey, balance: balance, address: publicKey, privateKey: '' });
      wallets.push(wallet);
    }

    res.status(StatusCodes.OK).json(wallets);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {post} Generate private key and send it
 */
router.get(paths.generatePrivateKey, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const privateKey = WalletUtil.generatePrivateKey();
    res.status(StatusCodes.OK).json(privateKey);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {get} Connect wallet with private key
 */
router.post(paths.connect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const privateKey = req.body.privateKey;
    if (!privateKey) {
      next(new ParamMissingError());
    }

    const result = await WalletRepo.connect(privateKey);
    res.status(StatusCodes.OK).json({ message: 'Wallet connected' });
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

function validateAddressParam(req: Request) {
  let address = req.params.address;
  if (!address) {
    throw new ParamMissingError();
  }
  if (!WalletValidator.validatePublicKey(address)) {
    throw new ParamsValueError();
  }
}

/**
 * @api {get} Get wallet balance for given address. If address is not provided, it will return the balance of the wallet
 */
router.get(paths.balance, async (req: Request, res: Response, next: NextFunction) => {
  try {
    let address = req.params.address;
    validateAddressParam(req);
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

    const blockchain = await BlockchainRepo.get();
    const unspentTxOuts = await UnspentTxOutRepo.getAll();
    const transactionPool = await TransactionPoolRepo.get();

    const historyTxs = _.flatten(blockchain.chain.map(block => block.data));

    wallet.successTxs = TransactionUtil.getTransactionByAddress(historyTxs, wallet.publicKey, unspentTxOuts).length;
    wallet.pendingTxs = TransactionUtil.getTransactionByAddress(transactionPool.transactions, wallet.publicKey, unspentTxOuts).length;

    if (!wallet) {
      next(new DataNotFound(Wallet.name));
    }
    res.status(StatusCodes.OK).json(wallet);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {delete} Disconnects wallet
 */
router.delete(paths.disconnect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await WalletRepo.delete();
    if (!result) {
      next(new Error('Could not disconnected/deleted the wallet'));
    }
    res.status(StatusCodes.OK).json({ message: 'Wallet disconnected/deleted' });
  } catch (error) {
    next(error);
  }
});



