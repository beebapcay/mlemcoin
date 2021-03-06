import { ConfigurationConstants } from '@node-process/constants/config.constant';
import { Transaction, TransactionUtil } from '@node-process/models/transaction.model';
import { WalletUtil } from '@node-process/models/wallet.model';
import { BlockchainRepo } from '@node-process/repos/blockchain.repo';
import { TransactionPoolRepo } from '@node-process/repos/transaction-pool.repo';
import { UnspentTxOutRepo } from '@node-process/repos/unspent-tx-out.repo';
import { WalletRepo } from '@node-process/repos/wallet.repo';
import { WalletValidator } from '@node-process/validators/wallet.validator';
import { P2PHandler } from '@p2p-process/handler/p2p.handler';
import { ResponseHandler } from '@p2p-process/handler/response.handler';
import { DataNotFound } from '@shared/errors/data-not-found.error';
import { ParamMissingError } from '@shared/errors/param-missing.error';
import { ParamsValueError } from '@shared/errors/params-value.errors';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as _ from 'lodash';

export const router = Router();

const paths = {
  getSuccessAllByAddress: '/:address/success',
  getPendingAllByAddress: '/:address/pending',
  mine: '/mine',
  send: '/send',
  beggarCreator: '/beggar-creator',
  beggarCoinbaseAward: '/beggar-coinbase-award',
  get: '/',
  getById: '/:id'
};


router.get(paths.getSuccessAllByAddress, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.params.address;
    if (!address) {
      next(new ParamMissingError());
    }
    if (!WalletValidator.validatePublicKey(address)) {
      next(new ParamsValueError());
    }

    const blockchain = await BlockchainRepo.get();
    const unspentTxOuts = await UnspentTxOutRepo.getAll();

    const txs = _.flatten(blockchain.chain.map(block => block.data));

    const txsFiltered = TransactionUtil.getTransactionByAddress(txs, address, unspentTxOuts);

    res.status(StatusCodes.OK).json(txsFiltered);
  } catch (err) {
    next(err);
  }
});

router.get(paths.getPendingAllByAddress, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.params.address;
    if (!address) {
      next(new ParamMissingError());
    }
    if (!WalletValidator.validatePublicKey(address)) {
      next(new ParamsValueError());
    }

    const transactionPool = await TransactionPoolRepo.get();
    const unspentTxOuts = await UnspentTxOutRepo.getAll();

    const txsFiltered = TransactionUtil.getTransactionByAddress(transactionPool.transactions, address, unspentTxOuts);
    res.status(StatusCodes.OK).json(txsFiltered);
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

    P2PHandler.broadcast(ResponseHandler.responseTransactionPool((await TransactionPoolRepo.get()).transactions));

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

    P2PHandler.broadcast(ResponseHandler.responseLatestBlock(await BlockchainRepo.getLatestBlock()));

    res.status(StatusCodes.OK).json(block);
  } catch (err) {
    next(err);
  }
});

router.get(paths.beggarCreator, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const myAddress = await WalletRepo.getPublicKey();
    const unspentTxOuts = await UnspentTxOutRepo.getAll();
    const transactionPool = await TransactionPoolRepo.get();

    const randomCoin = _.random(1, 50);

    const tx = WalletUtil.createTransaction(myAddress, randomCoin, ConfigurationConstants.CREATOR_PRIVATE, unspentTxOuts, transactionPool);

    await TransactionPoolRepo.add(tx);

    P2PHandler.broadcast(ResponseHandler.responseTransactionPool((await TransactionPoolRepo.get()).transactions));

    res.status(StatusCodes.OK).json(randomCoin);
  } catch (err) {
    next(err);
  }
});

router.get(paths.beggarCoinbaseAward, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockchain = await BlockchainRepo.get();
    const publicKey = await WalletRepo.getPublicKey();

    const rawBlock = blockchain.generateNextBlock(publicKey, []);

    const block = await BlockchainRepo.add(rawBlock);

    P2PHandler.broadcast(ResponseHandler.responseLatestBlock(await BlockchainRepo.getLatestBlock()));

    res.status(StatusCodes.OK).json(block);
  } catch (err) {
    next(err);
  }
});

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
