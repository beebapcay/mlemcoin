import childProcess from 'child_process';
import logger from 'jet-logger';

export class ExecUtil {
  public static exec(cmd: string, loc: string): Promise<void> {
    return new Promise((res, rej) => {
      return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
        if (!!stdout) {
          logger.info(stdout);
        }
        if (!!stderr) {
          logger.warn(stderr);
        }
        return (!!err ? rej(err) : res());
      });
    });
  }
}