import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class ParamsValueError extends CustomError {
  public static readonly MSG = 'One or more of the required parameters had an invalid value.';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(ParamsValueError.MSG, ParamsValueError.HTTPS_STATUS);
  }
}

