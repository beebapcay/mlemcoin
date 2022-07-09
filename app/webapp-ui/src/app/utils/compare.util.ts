export class CompareUtil {
  static compareValue(value1: any, value2: any): number {
    let result = null;

    if (value1 == null && value2 != null)
      result = -1;
    else if (value1 != null && value2 == null)
      result = 1;
    else if (value1 == null && value2 == null)
      result = 0;
    else if (typeof value1 === 'string' && typeof value2 === 'string')
      result = value1.localeCompare(value2);
    else
      result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

    return result;
  }
}
