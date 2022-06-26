import { UnspentTxOutRepo } from "@repos/unspent-tx-out.repo";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

export const router = Router();

export const paths = {
  get: "/",
  getByAddress: "/:address"
};

/**
 * @api {get} Get all unspent transaction outputs
 */
router.get(paths.get, async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(await UnspentTxOutRepo.getAll());
});

/**
 * @api {get} Get all unspent transaction outputs by address
 */
router.get(paths.getByAddress, async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(await UnspentTxOutRepo.getByAddress(req.params.address));
});