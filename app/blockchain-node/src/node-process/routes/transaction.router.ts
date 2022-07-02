import { Transaction } from '@node-process/models/transaction.model';
import { WalletUtil } from '@node-process/models/wallet.model';
import { BlockchainRepo } from '@node-process/repos/blockchain.repo';
import { TransactionPoolRepo } from '@node-process/repos/transaction-pool.repo';
import { UnspentTxOutRepo } from '@node-process/repos/unspent-tx-out.repo';
import { WalletRepo } from '@node-process/repos/wallet.repo';
import { DataNotFound } from '@shared/errors/data-not-found.error';
import { ParamMissingError } from '@shared/errors/param-missing.error';
import { ParamsValueError } from '@shared/errors/params-value.errors';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as _ from 'lodash';

export const router = Router();

const paths = {
  get: '/',
  getById: '/:id',
  mine: '/mine',
  send: '/send'
};

/**
 * @api {get} Get transaction by id from blockchain
 */
router.get(paths.getById, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockchain = await BlockchainRepo.get();
    const transaction = _.flatten(blockchain.chain.map(block => block.data)).find(transaction => transaction.id === req.params.id);
    if (!transaction) {
      next(new DataNotFound(Transaction.name));
    }
    res.status(StatusCodes.OK).json(transaction);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {get} Get all transactions from blockchain
 */
router.get(paths.get, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockchain = await BlockchainRepo.get();
    const transaction = _.flatten(blockchain.chain.map(block => block.data));
    res.status(StatusCodes.OK).json(transaction);
  } catch (err) {
    next(err);
  }
});

function validateTransactionParams(address: any, amount: any) {
  if (!address || !amount) {
    throw new ParamMissingError();
  }

  if (!_.isNumber(amount) || amount <= 0 || !_.isString(address)) {
    throw new ParamsValueError();
  }
}

/**
 * @api {post} Receive a transaction (address, amount) and add it to the transaction pool
 */
router.post(paths.send, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.body.address;
    const amount = parseInt(req.body.amount);

    validateTransactionParams(address, amount);

    const privateKey = await WalletRepo.getPrivateKey();
    const aUnspentTxOuts = await UnspentTxOutRepo.getAll();
    const transactionPool = await TransactionPoolRepo.get();

    const tx = WalletUtil.createTransaction(address, amount, privateKey, aUnspentTxOuts, transactionPool);

    await TransactionPoolRepo.add(tx);

    res.status(StatusCodes.OK).json(tx);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {post} Receive a transaction (address, amount), then mine and add it to the blockchain
 */
router.post(paths.mine, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.body.address;
    const amount = parseInt(req.body.amount);

    validateTransactionParams(address, amount);

    const blockchain = await BlockchainRepo.get();

    const privateKey = await WalletRepo.getPrivateKey();
    const aUnspentTxOuts = await UnspentTxOutRepo.getAll();
    const transactionPool = await TransactionPoolRepo.get();

    const tx = WalletUtil.createTransaction(address, amount, privateKey, aUnspentTxOuts, transactionPool);

    const rawBlock = blockchain.generateNextBlockWithTransaction(WalletUtil.getPublicKey(privateKey), tx);

    const block = await BlockchainRepo.add(rawBlock);

    res.status(StatusCodes.OK).json(block);
  } catch (err) {
    next(err);
  }
});