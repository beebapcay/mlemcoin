import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class InvalidBlock extends CustomError {
  public static readonly MSG = 'Invalid block';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidBlock.MSG, InvalidBlock.HTTPS_STATUS);
  }
}