import HttpStatusCodes from 'http-status-codes';

export abstract class CustomError extends Error {
  public readonly HTTPS_STATUS = HttpStatusCodes.BAD_REQUEST;

  protected constructor(msg: string, httpStatus: number) {
    super(msg);
    this.HTTPS_STATUS = httpStatus;
  }
}