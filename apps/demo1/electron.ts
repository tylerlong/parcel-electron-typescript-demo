import {app, BrowserWindow} from 'electron';
import path from 'path';

import './generated/ipc-main';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(
        __dirname,
        '..',
        '..',
        'build',
        'renderer',
        'preload.js'
      ),
    },
  });
  mainWindow.loadFile('build/renderer/index.html');

  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
