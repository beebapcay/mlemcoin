import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class DataNotFound extends CustomError {
  public static readonly MSG = 'Data not found';
  public static readonly HTTPS_STATUS = HttpStatusCodes.NOT_FOUND;

  constructor(type: string) {
    super(`${DataNotFound.MSG} - Type: ${type}`, DataNotFound.HTTPS_STATUS);
  }
}