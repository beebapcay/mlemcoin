export class ArrayUtil {
  public static hasDuplicates(arr: any[]): boolean {
    return arr.some((item, index) => arr.indexOf(item) !== index);
  }
}