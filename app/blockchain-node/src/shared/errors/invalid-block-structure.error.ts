import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class InvalidBlockStructure extends CustomError {
  public static readonly MSG = 'Invalid block structure';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidBlockStructure.MSG, InvalidBlockStructure.HTTPS_STATUS);
  }
}