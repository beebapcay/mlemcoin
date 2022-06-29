import { Message } from '@models/message.model';
import { MessageType } from '@shared/message-type.enum';
import logger from 'jet-logger';
import * as WebSocket from 'ws';
import { BlockValidator } from '../../../blockchain-node/src/validators/block.validator';
import { sockets } from '../sockets';
import { ErrorUtil } from '../utils/error.util';
import { JsonUtil } from '../utils/json.util';
import { ResponseHandler } from './response.handler';

export class MessageHandler {
  public static init(ws: WebSocket) {
    ws.on('message', async (data: string) => {
      try {
        const message = JsonUtil.parse<Message>(data);
        if (message === null) {
          ErrorUtil.pError(new Error('Could not parse message received to JSON'));
          return;
        }

        logger.info(`Received message: ${message}`);

        switch (message.type) {
          case MessageType.QUERY_LATEST:
            this.send(ws, await ResponseHandler.responseLatestBlock());
            break;
          case MessageType.QUERY_ALL:
            this.send(ws, await ResponseHandler.responseAllBlocks());
            break;
          case MessageType.QUERY_TRANSACTION_POOL:
            this.send(ws, await ResponseHandler.responseTransactionPool());
            break;
          case MessageType.RESPONSE_BLOCKCHAIN:
            const receivedBlocks = JSON.parse(message.data);
            if (receivedBlocks === null) {
              ErrorUtil.pError(new Error('Invalid blocks received'));
              return;
            }
            // TODO: handler response
            break;
          case MessageType.RESPONSE_TRANSACTION_POOL:
            const receivedTransactions = JSON.parse(message.data);
            if (receivedTransactions === null) {
              ErrorUtil.pError(new Error('Invalid transactions received'));
              return;
            }
            try {
              // TODO: handler response
            } catch (err) {
              ErrorUtil.pError(err);
            }
        }
      } catch (err) {
        ErrorUtil.pError(err);
      }
    });
  }

  public static send(ws: WebSocket, message: Message) {
    ws.send(JSON.stringify(message));
  }

  public static broadcast(message: Message) {
    sockets.forEach((ws) => {
      MessageHandler.send(ws, message);
    });
  }

  public static async handleBlockchainResponseMsg(receivedBlocks: any[]) {
    if (receivedBlocks === null) {
      ErrorUtil.pError(new Error('Invalid blocks received'));
      return;
    }

    if (receivedBlocks.length === 0) {
      logger.info('Received empty blockchain');
      return;
    }

    const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];

    if (!BlockValidator.validateStructure(latestBlockReceived)) {
      ErrorUtil.pError(new Error('Block structure is invalid'));
      return;
    }

    const latestBlockHeld = (await ResponseHandler.responseLatestBlock()).data;

    if (latestBlockReceived.index > latestBlockHeld.index) {
      logger.warn(`Blockchain possibly behind. We got: ${latestBlockHeld.index} Peer got: ${latestBlockReceived.index}`);

      if (latestBlockHeld.hash === latestBlockReceived.previousHash) {

      }
    }
  }
}