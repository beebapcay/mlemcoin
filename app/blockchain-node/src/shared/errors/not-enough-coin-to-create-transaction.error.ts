import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class NotEnoughCoinToCreateTransaction extends CustomError {
  public static readonly MSG = 'Not enough coin to create transaction';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(NotEnoughCoinToCreateTransaction.MSG, NotEnoughCoinToCreateTransaction.HTTPS_STATUS);
  }
}