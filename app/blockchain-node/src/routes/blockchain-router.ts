import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BlockchainRepo } from '@repos/blockchain.repo';

export const router = Router();

export const paths = {
  getBlocks: '/blocks',
};

/**
 * @api {get} Get all blocks of the blockchain
 */
router.get(paths.getBlocks, async (_: Request, res: Response) => {
  res.status(StatusCodes.OK).json(await BlockchainRepo.get());
});

