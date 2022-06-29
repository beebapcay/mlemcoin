import { DataNotFound, ParamMissingError } from '@shared/errors';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as _ from 'lodash';
import { Transaction } from '../models/transaction.model';
import { WalletUtil } from '../models/wallet.model';
import { BlockchainRepo } from '../repos/blockchain.repo';
import { TransactionPoolRepo } from '../repos/transaction-pool.repo';
import { UnspentTxOutRepo } from '../repos/unspent-tx-out.repo';
import { WalletRepo } from '../repos/wallet.repo';

export const router = Router();

const paths = {
  get: '/',
  getById: '/:id',
  mine: '/mine',
  send: '/send'
};

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

router.get(paths.get, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockchain = await BlockchainRepo.get();
    const transaction = _.flatten(blockchain.chain.map(block => block.data));
    res.status(StatusCodes.OK).json(transaction);
  } catch (err) {
    next(err);
  }
});

router.post(paths.send, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.body.address;
    const amount = req.body.amount;

    if (!address || !amount || parseInt(amount) <= 0) {
      next(new ParamMissingError());
    }

    const privateKey = await WalletRepo.getPrivateKey();
    const aUnspentTxOuts = await UnspentTxOutRepo.getAll();
    const transactionPool = await TransactionPoolRepo.get();

    const tx = WalletUtil.createTransaction(address, parseInt(amount), privateKey, aUnspentTxOuts, transactionPool);

    await TransactionPoolRepo.add(tx);

    res.status(StatusCodes.OK).json(tx);
  } catch (err) {
    next(err);
  }
});

router.post(paths.mine, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.body.address;
    const amount = req.body.amount;

    if (!address || !amount || parseInt(amount) <= 0) {
      next(new ParamMissingError());
    }

    const blockchain = await BlockchainRepo.get();

    const privateKey = await WalletRepo.getPrivateKey();
    const aUnspentTxOuts = await UnspentTxOutRepo.getAll();
    const transactionPool = await TransactionPoolRepo.get();

    const tx = WalletUtil.createTransaction(address, parseInt(amount), privateKey, aUnspentTxOuts, transactionPool);

    const rawBlock = blockchain.generateNextBlockWithTransaction(WalletUtil.getPublicKey(privateKey), tx);

    const block = await BlockchainRepo.add(rawBlock);

    res.status(StatusCodes.OK).json(block);
  } catch (err) {
    next(err);
  }
});