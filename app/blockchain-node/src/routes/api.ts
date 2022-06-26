import { Router } from 'express';
import { router as blockchainRouter } from '@routes/blockchain-router';

export const apiRouter = Router();

apiRouter.use('/blockchain', blockchainRouter);