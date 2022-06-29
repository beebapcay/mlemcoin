import { Message } from '@models/message.model';
import { MessageType } from '@shared/message-type.enum';
import * as axios from 'axios';

const blockchainNodeApi = 'http://localhost:8081/api';

export class ResponseHandler {
  public static async responseAllBlocks(): Promise<Message> {
    const chainBlocks = await axios.default.get(`${blockchainNodeApi}/blockchain/blocks`);
    return {
      type: MessageType.RESPONSE_BLOCKCHAIN,
      data: chainBlocks
    };
  }


  public static async responseLatestBlock(): Promise<Message> {
    const latestBlock = await axios.default.get(`${blockchainNodeApi}/blockchain/latest`);
    return {
      type: MessageType.RESPONSE_BLOCKCHAIN,
      data: [latestBlock]
    };
  }

  public static async responseTransactionPool(): Promise<Message> {
    const transactionPool = await axios.default.get(`${blockchainNodeApi}/transaction-pool`);
    return {
      type: MessageType.RESPONSE_TRANSACTION_POOL,
      data: transactionPool
    };
  }
}