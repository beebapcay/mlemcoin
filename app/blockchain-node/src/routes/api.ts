import { router as blockchainRouter } from "@routes/blockchain.router";
import { router as minerRouter } from "@routes/miner.router";
import { router as transactionPoolRouter } from "@routes/transaction-pool.router";
import { router as transactionRouter } from "@routes/transaction.router";
import { router as unspentTxOutRouter } from "@routes/unspent-tx-out.router";
import { router as walletRouter } from "@routes/wallet.router";
import { Router } from "express";

export const apiRouter = Router();

apiRouter.use("/blockchain", blockchainRouter);

apiRouter.use("/transactions", transactionRouter);

apiRouter.use("/wallet", walletRouter);

apiRouter.use("/unspent-tx-outs", unspentTxOutRouter);

apiRouter.use("/miner", minerRouter);

apiRouter.use("/transaction-pool", transactionPoolRouter);