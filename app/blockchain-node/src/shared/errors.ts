import HttpStatusCodes from 'http-status-codes';

export abstract class CustomError extends Error {
  public readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  protected constructor(msg: string, httpStatus: number) {
    super(msg);
    this.HTTPS_STATUS = httpStatus;
  }
}

export class ParamMissingError extends CustomError {
  public static readonly MSG = 'One or more of the required parameters was missing.';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(ParamMissingError.MSG, ParamMissingError.HTTPS_STATUS);
  }
}

export class ReferenceTxOutNotFound extends CustomError {
  public static readonly MSG = 'No referenced UTxO found';
  public static readonly HTTPS_STATUS = HttpStatusCodes.NOT_FOUND;

  constructor(id: string, index: number) {
    super(`${ReferenceTxOutNotFound.MSG} - TxOut: ${{id, index}}`, ReferenceTxOutNotFound.HTTPS_STATUS);
  }
}

export class InvalidSignature extends CustomError {
  public static readonly MSG = 'Invalid signature';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidSignature.MSG, InvalidSignature.HTTPS_STATUS);
  }
}

export class SignTransactionFromWrongAddress extends CustomError {
  public static readonly MSG = 'Trying to sign an input with private key of another address';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(SignTransactionFromWrongAddress.MSG, SignTransactionFromWrongAddress.HTTPS_STATUS);
  }
}

export class InvalidTransactionId extends CustomError {
  public static readonly MSG = 'Invalid transaction id';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidTransactionId.MSG, InvalidTransactionId.HTTPS_STATUS);
  }
}

export class TxInAmountNotMatchTxOutAmount extends CustomError {
  public static readonly MSG = 'TxIn amount does not match TxOut amount';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(TxInAmountNotMatchTxOutAmount.MSG, TxInAmountNotMatchTxOutAmount.HTTPS_STATUS);
  }
}

export class CoinbaseTransactionEmpty extends CustomError {
  public static readonly MSG = 'Coinbase transaction cannot be empty';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(CoinbaseTransactionEmpty.MSG, CoinbaseTransactionEmpty.HTTPS_STATUS);
  }
}

export class InvalidHash extends CustomError {
  public static readonly MSG = 'Invalid hash';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidHash.MSG, InvalidHash.HTTPS_STATUS);
  }
}

export class HashNotMatchDifficulty extends CustomError {
  public static readonly MSG = 'Hash does not match difficulty';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(HashNotMatchDifficulty.MSG, HashNotMatchDifficulty.HTTPS_STATUS);
  }
}

export class InvalidGeneris extends CustomError {
  public static readonly MSG = 'Invalid generis';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(InvalidGeneris.MSG, InvalidGeneris.HTTPS_STATUS);
  }
}

export class NotEnoughCoinToCreateTransaction extends CustomError {
  public static readonly MSG = 'Not enough coin to create transaction';
  public static readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  constructor() {
    super(NotEnoughCoinToCreateTransaction.MSG, NotEnoughCoinToCreateTransaction.HTTPS_STATUS);
  }
}