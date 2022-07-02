import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class InvalidGeneris extends CustomError {
  public static readonly MSG = 'Invalid generis';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidGeneris.MSG, InvalidGeneris.HTTPS_STATUS);
  }
}