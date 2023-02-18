import {BrowserWindow} from 'electron';

class BaseElectronAPI {
  send(window: BrowserWindow, ...messages) {
    window.webContents.send('from-electron', ...messages);
  }
}

export default BaseElectronAPI;
