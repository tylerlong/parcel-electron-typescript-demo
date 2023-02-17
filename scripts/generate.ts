import path from 'path';
import fs from 'fs';

const generate = async (app: string) => {
  const appFolder = path.join(__dirname, '..', 'apps', app);
  const Preload = (await import(path.join(appFolder, 'preload.ts'))).default;
  const methods = Reflect.ownKeys(Preload.prototype)
    .map(s => s.toString())
    .filter(name => name !== 'constructor');
  const preloadTs =
    `
import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('preload', {
${methods
  .map(method => `  ${method}: () => ipcRenderer.invoke('${method}'),`)
  .join('\n')}
});
  `.trim() + '\n';
  fs.writeFileSync(path.join(appFolder, 'generated', 'preload.ts'), preloadTs);
  const ipcMainTs =
    `
import {ipcMain} from 'electron';
import Preload from '../preload';

const preload = new Preload();
${methods
  .map(method => `ipcMain.handle('${method}', preload.${method});`)
  .join('\n')}
`.trim() + '\n';
  fs.writeFileSync(path.join(appFolder, 'generated', 'ipc-main.ts'), ipcMainTs);
};

export default generate;
