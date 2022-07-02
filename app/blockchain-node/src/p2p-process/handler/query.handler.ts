import { Message } from '@p2p-process/models/message.model';
import { MessageType } from '@shared/../../../blockchain-node/src/p2p-process/enums/message-type.enum';

export class QueryHandler {
  public static queryChainBlocks(): Message {
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