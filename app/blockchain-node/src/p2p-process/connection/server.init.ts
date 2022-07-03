import { ConnectionInit } from '@p2p-process/connection/connection.init';
import logger from 'jet-logger';
import WebSocket from 'ws';

export class ServerInit {
  public static init(p2pPort: number): void {
    const server = new WebSocket.Server({ port: p2pPort });
    server.on('connection', (ws: WebSocket) => {
      ConnectionInit.init(ws);
    });
    logger.info(`P2P node server started on port: ${p2pPort}`);
  }
}