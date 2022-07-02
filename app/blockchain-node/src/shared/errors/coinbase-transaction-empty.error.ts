import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class CoinbaseTransactionEmpty extends CustomError {
  public static readonly MSG = 'Coinbase transaction cannot be empty';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(CoinbaseTransactionEmpty.MSG, CoinbaseTransactionEmpty.HTTPS_STATUS);
  }
}