import { MessageType } from '@p2p-process/enums/message-type.enum';
import { ObjectUtil } from '@shared/utils/object.util';

export interface IMessage {
  type: MessageType;
  data: any;
}

export class Message extends ObjectUtil.autoImplement<IMessage>() {
  constructor(messageShape: IMessage) {
    super();
    this.type = messageShape.type;
    this.data = messageShape.data;
  }
}