import { ConnectionPool } from '@p2p-process/connection/connection.pool';
import { Message } from '@p2p-process/models/message.model';
import WebSocket from 'ws';

export class P2PHandler {
  public static send(ws: WebSocket, message: Message): void {
    ws.send(JSON.stringify(message));
  }

  public static broadcast(message: Message): void {
    ConnectionPool.connections.forEach((ws) => {
      P2PHandler.send(ws, message);
    });
  }
}