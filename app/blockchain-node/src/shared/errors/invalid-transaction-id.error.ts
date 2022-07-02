import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class InvalidTransactionId extends CustomError {
  public static readonly MSG = 'Invalid transaction id';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidTransactionId.MSG, InvalidTransactionId.HTTPS_STATUS);
  }
}