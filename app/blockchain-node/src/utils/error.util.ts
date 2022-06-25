import logger from 'jet-logger';

export class ErrorUtil {
  public static pError(err?: Error): void {
    if (!!err) {
      logger.err(err);
    }
  }
}
