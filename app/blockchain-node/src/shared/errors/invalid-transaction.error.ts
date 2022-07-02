import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class InvalidTransaction extends CustomError {
  public static readonly MSG = 'Invalid transaction';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidTransaction.MSG, InvalidTransaction.HTTPS_STATUS);
  }
}