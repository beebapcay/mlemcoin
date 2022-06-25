import logger from 'jet-logger';


/**
 * @description - Print an error object if it's truthy. Useful for testing.
 *
 * @param err
 */
export class ErrorUtil {
  public static pError(err?: Error): void {
    if (!!err) {
      logger.err(err);
    }
  }
}