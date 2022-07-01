import { ConnectionPool } from '@p2p-process/connection/connection.pool';
import { ErrorHandler } from '@p2p-process/handler/error.handler';
import { MessageHandler } from '@p2p-process/handler/message.handler';
import { P2PHandler } from '@p2p-process/handler/p2p.handler';
import { ResponseHandler } from '@p2p-process/handler/response.handler';
import * as WebSocket from 'ws';

export class ConnectionInit {
  public static init(ws: WebSocket): void {
    ConnectionPool.connections.push(ws);

    console.log(`Connected to ${ws.url}`);

    MessageHandler.init(ws);

    ErrorHandler.init(ws);

    P2PHandler.send(ws, ResponseHandler.queryLatestBlock());

    setTimeout(() => {
      P2PHandler.broadcast(ResponseHandler.queryTransactionPool());
    }, 1000);
  }
}