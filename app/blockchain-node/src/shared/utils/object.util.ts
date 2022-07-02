export class ObjectUtil {
  public static autoImplement<T>(defaults?: Partial<T>) {
    return class {
      constructor() {
        Object.assign(this, defaults ?? {});
      }
    } as new () => T;
  }

  public static autoImplementWithBase<TBase extends new (...args: any[]) => any>(base: TBase) {
    return function <T>(defaults?: Partial<T>): Pick<TBase, keyof TBase> & {
      new(...a: (TBase extends new (...o: infer A) => unknown ? A : [])): InstanceType<TBase> & T
    } {
      return class extends base {
        constructor(...a: any[]) {
          super(...a);
          Object.assign(this, defaults || {});
        }
      } as any;
    };
  }
}
