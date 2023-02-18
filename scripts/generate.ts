import path from 'path';
import fs from 'fs';

import {run} from './utils';

const generate = async (app: string) => {
  const appFolder = path.join(__dirname, '..', 'apps', app);
  const generatedFolder = path.join(appFolder, 'generated');
  if (fs.existsSync(generatedFolder)) {
    fs.rmSync(generatedFolder, {
      recursive: true,
      force: true,
    });
  }
  fs.mkdirSync(generatedFolder);
  const ElectronAPI = (await import(path.join(appFolder, 'electron-api.ts')))
    .default;
  const methods = Reflect.ownKeys(ElectronAPI.prototype)
    .map(s => s.toString())
    .filter(name => name !== 'constructor');

  // preload.ts
  const preloadTs =
    `
import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
${methods
  .map(
    method =>
      `  ${method}: (...args: string[]) => ipcRenderer.invoke('${method}', ...args),`
  )
  .join('\n')}
});
  `.trim() + '\n';
  fs.writeFileSync(path.join(generatedFolder, 'preload.ts'), preloadTs);

  // ipc-main.ts
  const ipcMainTs =
    `
import {ipcMain} from 'electron';
import ElectronAPI from '../electron-api';

const electronAPI = new ElectronAPI();
${methods
  .map(
    method =>
      `ipcMain.handle('${method}', (event, ...args: string[]) => Reflect.apply(electronAPI.${method}, electronAPI, args));`
  )
  .join('\n')}
`.trim() + '\n';
  fs.writeFileSync(path.join(generatedFolder, 'ipc-main.ts'), ipcMainTs);

  // types.d.ts
  const typesDts =
    `
declare namespace electronAPI {
${methods.map(method => `  function ${method}(...args: string[]);`).join('\n')}
}
`.trim() + '\n';
  fs.writeFileSync(path.join(generatedFolder, 'types.d.ts'), typesDts);

  await run('yarn', 'eslint', generatedFolder, '--fix');
};

export default generate;
