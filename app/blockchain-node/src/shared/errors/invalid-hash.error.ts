import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class InvalidHash extends CustomError {
  public static readonly MSG = 'Invalid hash';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidHash.MSG, InvalidHash.HTTPS_STATUS);
  }
}