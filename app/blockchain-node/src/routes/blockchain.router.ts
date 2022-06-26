import { Block } from "@models/block.model";
import { BlockchainRepo } from "@repos/blockchain.repo";
import { DataNotFound } from "@shared/errors";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

export const router = Router();

export const paths = {
  getBlocks: "/blocks",
  getBlockByHash: "/blocks/:hash"
};

/**
 * @api {get} Get all blocks of the blockchain
 */
router.get(paths.getBlocks, async (_: Request, res: Response) => {
  res.status(StatusCodes.OK).json(await BlockchainRepo.get());
});

/**
 * @api {get} Get block by hash
 */
router.get(paths.getBlockByHash, async (req: Request, res: Response) => {
  const block = await BlockchainRepo.getByHash(req.params.hash);
  if (block) {
    res.status(StatusCodes.OK).json(block);
  } else throw new DataNotFound(Block.name);
});