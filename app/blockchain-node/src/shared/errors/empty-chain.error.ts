import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class EmptyChainError extends CustomError {
  public static readonly MSG = 'No blocks in the chain. Need to add a genesis block. Or something else is wrong.';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(EmptyChainError.MSG, EmptyChainError.HTTPS_STATUS);
  }
}