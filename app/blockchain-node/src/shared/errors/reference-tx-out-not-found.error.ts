import { CustomError } from '@shared/errors/custom.error';
import HttpStatusCodes from 'http-status-codes';

export class ReferenceTxOutNotFound extends CustomError {
  public static readonly MSG = 'No referenced UTxO found';
  public static readonly HTTPS_STATUS = HttpStatusCodes.NOT_FOUND;

  constructor(id: string, index: number) {
    super(`${ReferenceTxOutNotFound.MSG} - TxOut: ${{ id: id, index: index }}`, ReferenceTxOutNotFound.HTTPS_STATUS);
  }
}