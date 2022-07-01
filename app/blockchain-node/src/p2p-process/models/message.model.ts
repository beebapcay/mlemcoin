import { MessageType } from '@p2p-process/enums/message-type.enum';
import { InterfaceUtil } from '@shared/utils/interface.util';

export interface IMessage {
  type: MessageType;
  data: any;
}

export class Message extends InterfaceUtil.autoImplement<IMessage>() {
  constructor(messageShape: IMessage) {
    super();
  }
}