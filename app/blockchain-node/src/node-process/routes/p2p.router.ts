import { ConnectionInit } from '@p2p-process/connection/connection.init';
import { ConnectionPool } from '@p2p-process/connection/connection.pool';
import { ParamMissingError } from '@shared/errors/param-missing.error';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

export const router = Router();

const paths = {
  get: '/',
  add: '/add',
  stop: '/stop'
};

/**
 * @api {get} Get all connected peers
 */
router.get(paths.get, (req: Request, res: Response, next: NextFunction) => {
  try {
    const connectionSockets = ConnectionPool.connections.map(ws => ws.url.substring(ws.url.indexOf('//') + 2));
    res.status(StatusCodes.OK).json(connectionSockets);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {post} Add a peer
 */
router.post(paths.add, (req: Request, res: Response, next: NextFunction) => {
  try {
    const peer = req.body.peer;
    if (!peer) {
      next(new ParamMissingError());
    }
    ConnectionInit.connect(peer);
    res.status(StatusCodes.OK).json({ message: 'Connected to peer' });
  } catch (err) {
    next(err);
  }
});

/**
 * @api {post} Stop the node
 */
router.post(paths.stop, (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(StatusCodes.OK).json({ message: 'Stopping server' });
    process.exit();
  } catch (err) {
    next(err);
  }
});