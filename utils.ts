import {spawn} from 'child_process';

export const run = (command: string, ...args: readonly string[]) => {
  if (process.platform === 'win32' && command === 'yarn') {
    command = 'yarn.cmd';
  }
  const childProcess = spawn(command, args, {stdio: 'inherit'});
  return new Promise<void>((resolve, reject) => {
    childProcess.once(
      'exit',
      (code: number | null, signal: NodeJS.Signals | null) => {
        if (code === 0) {
          resolve();
        } else {
          reject(signal);
        }
      }
    );
  });
};
