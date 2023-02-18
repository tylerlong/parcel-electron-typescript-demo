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
  const electronAPI = (await import(path.join(appFolder, 'electron-api.ts')))
    .ElectronAPI;
  const methods = Reflect.ownKeys(electronAPI.prototype)
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
      `  ${method}: (...args) => ipcRenderer.invoke('${method}', ...args),`
  )
  .join('\n')}
  onMessage: callback => ipcRenderer.on('from-electron', callback),
});
  `.trim() + '\n';
  fs.writeFileSync(path.join(generatedFolder, 'preload.ts'), preloadTs);

  // ipc-main.ts
  const ipcMainTs =
    `
import {ipcMain} from 'electron';
import electronAPI from '../electron-api';

${methods
  .map(
    method => `ipcMain.handle('${method}', (...args) =>
  Reflect.apply(electronAPI.${method}, electronAPI, args)
);`
  )
  .join('\n')}
`.trim() + '\n';
  fs.writeFileSync(path.join(generatedFolder, 'ipc-main.ts'), ipcMainTs);

  // types.d.ts
  const typesDts =
    `
declare namespace electronAPI {
${methods.map(method => `  function ${method}(...args);`).join('\n')}
  function onMessage(callback);
}
`.trim() + '\n';
  fs.writeFileSync(path.join(generatedFolder, 'types.d.ts'), typesDts);
};

export default generate;
