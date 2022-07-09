import * as _ from 'lodash';

export class ArrayUtil {
  static equals(array1: any[], array2: any[], sortFunc?: (a: any, b: any) => number): boolean {
    if (sortFunc) {
      array1 = array1.sort(sortFunc);
      array2 = array2.sort(sortFunc);
    }
    return _.isEqual(array1, array2);
  }
}
