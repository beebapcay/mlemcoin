import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class HashNotMatchDifficulty extends CustomError {
  public static readonly MSG = 'Hash does not match difficulty';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(HashNotMatchDifficulty.MSG, HashNotMatchDifficulty.HTTPS_STATUS);
  }
}