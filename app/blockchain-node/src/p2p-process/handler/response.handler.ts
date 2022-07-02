import { Block } from '@node-process/models/block.model';
import { Transaction } from '@node-process/models/transaction.model';
import { Message } from '@p2p-process/models/message.model';
import { MessageType } from '@shared/../../../blockchain-node/src/p2p-process/enums/message-type.enum';

export class ResponseHandler {
  public static responseAllBlocks(chain: Block[]): Message {
    return {
      type: MessageType.RESPONSE_BLOCKCHAIN,
      data: chain
    };
  }

  public static responseLatestBlock(latestBlock: Block | null): Message {
    return {
      type: MessageType.RESPONSE_BLOCKCHAIN,
      data: [latestBlock]
    };
  }

  public static responseTransactionPool(transactions: Transaction[]): Message {
    return {
      type: MessageType.RESPONSE_TRANSACTION_POOL,
      data: transactions
    };
  }

  public static queryAllBlocks(): Message {
    return {
      type: MessageType.QUERY_ALL,
      data: null
    };
  }

  public static queryLatestBlock(): Message {
    return {
      type: MessageType.QUERY_LATEST,
      data: null
    };
  }

  public static queryTransactionPool(): Message {
    return {
      type: MessageType.QUERY_TRANSACTION_POOL,
      data: null
    };
  }
}