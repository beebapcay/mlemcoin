import { TransactionPoolRepo } from "@repos/transaction-pool.repo";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

export const router = Router();

const paths = {
  get: "/"
};

router.get(paths.get, async (req: Request, res: Response) => {
  const transactionPool = await TransactionPoolRepo.get();
  res.status(StatusCodes.OK).json(transactionPool);
});