import { MessageType } from '../enum/message-type.enum';

export class Message {
  constructor(
    public type: MessageType,
    public data: any
  ) {
  }
}