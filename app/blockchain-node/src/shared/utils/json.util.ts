import { ErrorUtil } from '@shared/utils/error.util';

export class JsonUtil {
  public static parse<T>(json: string): T | null {
    try {
      return JSON.parse(json);
    } catch (err) {
      ErrorUtil.pError(err);
      return null;
    }
  }
}