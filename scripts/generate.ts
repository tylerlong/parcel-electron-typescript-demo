import path from 'path';
import fs from 'fs';

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
  const Preload = (await import(path.join(appFolder, 'preload.ts'))).default;
  const methods = Reflect.ownKeys(Preload.prototype)
    .map(s => s.toString())
    .filter(name => name !== 'constructor');

  // preload.ts
  const preloadTs =
    `
import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('preload', {
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
import Preload from '../preload';

const preload = new Preload();
${methods
  .map(method => `ipcMain.handle('${method}', preload.${method});`)
  .join('\n')}
`.trim() + '\n';
  fs.writeFileSync(path.join(generatedFolder, 'ipc-main.ts'), ipcMainTs);

  // types.d.ts
  const typesDts =
    `
declare namespace preload {
${methods.map(method => `  function ${method}(...args: string[]);`).join('\n')}
}
`.trim() + '\n';
  fs.writeFileSync(path.join(generatedFolder, 'types.d.ts'), typesDts);
};

export default generate;
