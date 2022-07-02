import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class ParamMissingError extends CustomError {
  public static readonly MSG = 'One or more of the required parameters was missing.';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(ParamMissingError.MSG, ParamMissingError.HTTPS_STATUS);
  }
}