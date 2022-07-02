import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class InvalidBlockTransactionsError extends CustomError {
  public static readonly MSG = 'Invalid block transactions';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidBlockTransactionsError.MSG, InvalidBlockTransactionsError.HTTPS_STATUS);
  }
}