import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class TxInAmountNotMatchTxOutAmount extends CustomError {
  public static readonly MSG = 'TxIn amount does not match TxOut amount';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(TxInAmountNotMatchTxOutAmount.MSG, TxInAmountNotMatchTxOutAmount.HTTPS_STATUS);
  }
}