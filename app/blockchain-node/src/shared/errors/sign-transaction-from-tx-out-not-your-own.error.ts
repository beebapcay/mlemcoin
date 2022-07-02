import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class SignTransactionFromTxOutNotYourOwn extends CustomError {
  public static readonly MSG = 'Trying to sign an input with private key of another address';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(SignTransactionFromTxOutNotYourOwn.MSG, SignTransactionFromTxOutNotYourOwn.HTTPS_STATUS);
  }
}