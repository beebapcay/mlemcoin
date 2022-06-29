import { ErrorUtil } from '../handler/error.util';

export class JsonUtil {
  public static parse<T>(json: string): T {
    try {
      return JSON.parse(json);
    } catch (e) {
      ErrorUtil.pError(e);
      return null;
    }
  }
}