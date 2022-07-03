import * as fs from 'fs-extra';

export class FileUtil {
  public static remove(loc: string): Promise<void> {
    return new Promise((res, rej) => {
      return fs.remove(loc, (err) => {
        return (!!err ? rej(err) : res());
      });
    });
  }


  public static copy(src: string, dest: string): Promise<void> {
    return new Promise((res, rej) => {
      return fs.copy(src, dest, (err) => {
        return (!!err ? rej(err) : res());
      });
    });
  }
}

