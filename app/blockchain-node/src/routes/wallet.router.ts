import { Wallet } from "@models/wallet.model";
import { WalletRepo } from "@repos/wallet.repo";
import { DataNotFound } from "@shared/errors";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

export const router = Router();

const paths = {
  address: "/address",
  balance: "/balance/:address"
};

router.get(paths.address, async (req: Request, res: Response) => {
  const publicKey = await WalletRepo.getPublicKey();
  if (!publicKey) {
    throw new DataNotFound(Wallet.name);
  }
  res.status(StatusCodes.OK).json(publicKey);
});

router.get(paths.balance, async (req: Request, res: Response) => {
  let address = req.params.address;
  if (!address) {
    address = await WalletRepo.getPublicKey();
  }
  const balance = await WalletRepo.getBalance(address);
  res.status(StatusCodes.OK).json(balance);
});

