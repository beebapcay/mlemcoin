import { Block } from '@node-process/models/block.model';
import { Transaction } from '@node-process/models/transaction.model';
import { BlockchainRepo } from '@node-process/repos/blockchain.repo';
import { TransactionPoolRepo } from '@node-process/repos/transaction-pool.repo';
import { BlockValidator } from '@node-process/validators/block.validator';
import { MessageType } from '@p2p-process/enums/message-type.enum';
import { P2PHandler } from '@p2p-process/handler/p2p.handler';
import { ResponseHandler } from '@p2p-process/handler/response.handler';
import { Message } from '@p2p-process/models/message.model';
import { ErrorUtil } from '@shared/utils/error.util';
import { JsonUtil } from '@shared/utils/json.util';
import logger from 'jet-logger';
import * as _ from 'lodash';
import * as WebSocket from 'ws';


export class MessageHandler {
  public static init(ws: WebSocket) {
    ws.on('message', async (data: string) => {
      try {
        const message = JsonUtil.parse<Message>(data);
        if (!message) {
          ErrorUtil.pError(new Error('Could not parse message received to JSON'));
          return;
        }

        logger.info(`Received message: ${message}`);

        switch (message.type) {
          case MessageType.QUERY_LATEST:
            const latestBlock = (await BlockchainRepo.get()).getLatestBlock();
            P2PHandler.send(ws, ResponseHandler.responseLatestBlock(latestBlock));
            break;
          case MessageType.QUERY_ALL:
            const chain = (await BlockchainRepo.get()).chain;
            P2PHandler.send(ws, ResponseHandler.responseAllBlocks(chain));
            break;
          case MessageType.QUERY_TRANSACTION_POOL:
            const transactions = (await TransactionPoolRepo.get()).transactions;
            P2PHandler.send(ws, ResponseHandler.responseTransactionPool(transactions));
            break;
          case MessageType.RESPONSE_BLOCKCHAIN:
            const receivedBlocks = JsonUtil.parse<Block[]>(message.data);
            if (!receivedBlocks) {
              ErrorUtil.pError(new Error('Invalid blocks received'));
              return;
            }
            await MessageHandler.handleReceivedBlockchain(receivedBlocks);
            break;
          case MessageType.RESPONSE_TRANSACTION_POOL:
            const receivedTransactions = JsonUtil.parse<Transaction[]>(message.data);
            if (!receivedTransactions) {
              ErrorUtil.pError(new Error('Invalid transactions received'));
              return;
            }

            receivedTransactions.forEach(transaction => {
              try {
                TransactionPoolRepo.add(transaction).then(() => {
                  TransactionPoolRepo.get().then(transactionPool => {
                    P2PHandler.broadcast(ResponseHandler.responseTransactionPool(transactionPool.transactions));
                  });
                });
              } catch (err) {
                ErrorUtil.pError(err);
              }
            });
        }
      } catch (err) {
        ErrorUtil.pError(err);
      }
    });
  }

  public static async handleReceivedBlockchain(receivedBlocks: Block[]) {
    if (!receivedBlocks || !_.isArray(receivedBlocks)) {
      ErrorUtil.pError(new Error('Invalid blocks received'));
      return;
    }

    if (receivedBlocks.length === 0) {
      logger.info('Received empty blockchain. Ignoring.');
      return;
    }

    const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];

    if (!BlockValidator.validateStructure(latestBlockReceived)) {
      ErrorUtil.pError(new Error('Block structure is invalid'));
      return;
    }

    const latestBlockHeld = (await BlockchainRepo.get()).getLatestBlock();

    if (latestBlockReceived.index > latestBlockHeld.index) {
      logger.warn(`Blockchain possibly behind. We got: ${latestBlockHeld.index} Peer got: ${latestBlockReceived.index}`);

      if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
        if (await BlockchainRepo.add(latestBlockReceived)) {
          logger.info(`Added block ${latestBlockReceived.index} to the blockchain`);
          P2PHandler.broadcast(ResponseHandler.responseLatestBlock(latestBlockReceived));
        }
      } else if (receivedBlocks.length === 1) {
        logger.warn('We have to query the chain from our peer');
        P2PHandler.broadcast(ResponseHandler.queryAllBlocks());
      } else {
        logger.warn('Received blockchain is longer than current blockchain.');
        await BlockchainRepo.updateChain(receivedBlocks);
        P2PHandler.broadcast(ResponseHandler.responseAllBlocks(receivedBlocks));
      }
    } else {
      logger.info('Received blockchain is not longer than current blockchain. Ignoring.');
    }
  }
}