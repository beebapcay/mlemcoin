import { Wallet } from "@models/wallet.model";
import { BlockchainRepo } from "@repos/blockchain.repo";
import { WalletRepo } from "@repos/wallet.repo";
import { DataNotFound } from "@shared/errors";
import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

export const router = Router();

const paths = {
  get: "/",
  init: "/init",
  address: "/address",
  balance: "/balance/:address",
  delete: "/"
};

router.post(paths.init, async (_: Request, res: Response, next: NextFunction) => {
  try {
    const result = await WalletRepo.init();
    if (!result) {
      res.status(StatusCodes.CONFLICT).send("Wallet already exists or Could not create wallet");
    }

    // Create dummy wallet balance
    const blockchain = await BlockchainRepo.get();

    const publicKey = await WalletRepo.getPublicKey();

    const rawBlock = blockchain.generateNextBlock(publicKey, []);
    const block = await BlockchainRepo.add(rawBlock);

    res.status(StatusCodes.CREATED).send("Wallet created");
  } catch (error) {
    next(error);
  }
});

router.get(paths.address, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const publicKey = await WalletRepo.getPublicKey();
    if (!publicKey) {
      next(new DataNotFound(Wallet.name));
    }
    res.status(StatusCodes.OK).json(publicKey);
  } catch (error) {
    next(error);
  }
});

router.get(paths.balance, async (req: Request, res: Response) => {
  let address = req.params.address;
  if (!address) {
    address = await WalletRepo.getPublicKey();
  }
  const balance = await WalletRepo.getBalance(address);
  res.status(StatusCodes.OK).json(balance);
});

router.get(paths.get, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wallet = await WalletRepo.get();
    if (!wallet) {
      next(new DataNotFound(Wallet.name));
    }
    res.status(StatusCodes.OK).json(wallet);
  } catch (err) {
    next(err);
  }
});

router.delete(paths.delete, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await WalletRepo.delete();
    if (!result) {
      next(new Error("Could not delete wallet"));
    }
    res.status(StatusCodes.OK).send("Wallet deleted");
  } catch (error) {
    next(error);
  }
});

