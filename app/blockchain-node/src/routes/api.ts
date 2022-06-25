import { router as blockchainRouter } from '@routes/blockchain-router';
import { Router } from 'express';

export const baseRouter = Router();

baseRouter.use('/blockchain', blockchainRouter);

export default baseRouter;