import { Block } from '@node-process/models/block.model';
import { BlockchainRepo } from '@node-process/repos/blockchain.repo';
import { DataNotFound } from '@shared/errors/data-not-found.error';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';


export const router = Router();

export const paths = {
  getBlocks: '/blocks',
  getBlockByHash: '/blocks/:hash'
};

/**
 * @api {get} Gets all blocks of the blockchain
 */
router.get(paths.getBlocks, async (_: Request, res: Response, next: NextFunction) => {
  try {
    const blockchain = await BlockchainRepo.get();
    res.status(StatusCodes.OK).json(blockchain);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {get} Gets block by hash
 */
router.get(paths.getBlockByHash, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const block = await BlockchainRepo.getByHash(req.params.hash);
    if (!block) {
      next(new DataNotFound(Block.name));
    }
    res.status(StatusCodes.OK).json(block);
  } catch (err) {
    next(err);
  }
});