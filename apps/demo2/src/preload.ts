import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('preload', {
  readFile: () => ipcRenderer.invoke('readFile'),
});
