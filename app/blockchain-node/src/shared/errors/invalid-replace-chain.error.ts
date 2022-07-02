import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class InvalidReplaceChain extends CustomError {
  public static readonly MSG = 'Invalid chain or not larger accumulated difficulty than current chain';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidReplaceChain.MSG, InvalidReplaceChain.HTTPS_STATUS);
  }
}