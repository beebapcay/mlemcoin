import WebSocket from 'ws';

export class ConnectionPool {
  public static connections: WebSocket[] = [];
}