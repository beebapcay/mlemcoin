import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class InvalidBlockTimestamp extends CustomError {
  public static readonly MSG = 'Invalid block timestamp';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidBlockTimestamp.MSG, InvalidBlockTimestamp.HTTPS_STATUS);
  }
}