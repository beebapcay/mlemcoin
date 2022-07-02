import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class InvalidSignature extends CustomError {
  public static readonly MSG = 'Invalid signature';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidSignature.MSG, InvalidSignature.HTTPS_STATUS);
  }
}