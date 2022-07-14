import { Transaction } from '@node-process/models/transaction.model';
import { BlockchainRepo } from '@node-process/repos/blockchain.repo';
import { TransactionPoolRepo } from '@node-process/repos/transaction-pool.repo';
import { UnspentTxOutRepo } from '@node-process/repos/unspent-tx-out.repo';
import { WalletRepo } from '@node-process/repos/wallet.repo';
import { P2PHandler } from '@p2p-process/handler/p2p.handler';
import { ResponseHandler } from '@p2p-process/handler/response.handler';
import { ParamMissingError } from '@shared/errors/param-missing.error';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

export const router = Router();

const paths = {
  mineNewBlock: '/new-block',
  mineTransaction: '/transaction',
  mineTxs: '/mine-txs'
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

router.post(paths.mineTxs, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const txs = req.body.txs as Transaction[];
    if (!txs) {
      next(new ParamMissingError());
    }

    const publicKey = await WalletRepo.getPublicKey();
    const blockchain = await BlockchainRepo.get();
    const transactionPool = await TransactionPoolRepo.get();
    const unspentTxOuts = await UnspentTxOutRepo.getAll();

    const txsConfirmed = txs
      .map(tx => transactionPool.transactions.find(t => t.id === tx.id))
      .reduce((acc, tx) => {
        if (tx) {
          acc.push(tx);
        }
        return acc;
      }, [] as Transaction[]);

    if (txsConfirmed.length !== txs.length) {
      next(new Error('Some transactions are not in the pool. Check the transaction pool again.'));
    }

    const rawBlock = blockchain.generateNextBlock(publicKey, txsConfirmed);

    const block = await BlockchainRepo.add(rawBlock);

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
