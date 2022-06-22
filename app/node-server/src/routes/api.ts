import { Router } from 'express';
import blockchain from '../models/blockchain.model';
import app from '../server';

const baseRouter = Router();

baseRouter.get('/block', (req, res) => {
  res.send(blockchain.chain);
});

baseRouter.post('/mine-block', (req, res) => {
  const newBlock = blockchain.generateNextBlock(req.body.data);
  blockchain.addBlock(newBlock);
  res.send(newBlock);
});

export default baseRouter;
