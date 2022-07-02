import { ConnectionPool } from '@p2p-process/connection/connection.pool';
import { ErrorUtil } from '@shared/utils/error.util';
import logger from 'jet-logger';
import WebSocket from 'ws';

export class ErrorHandler {
  public static init(ws: WebSocket) {
    const closeConnection = (ws: WebSocket) => {
      logger.info(`Connection closed: ${ws.url}`);
      ConnectionPool.connections.splice(ConnectionPool.connections.indexOf(ws), 1);
    };

    ws.on('close', () => {
      closeConnection(ws);
    });

    ws.on('error', (err: Error) => {
      ErrorUtil.pError(err);
      closeConnection(ws);
    });
  }
}