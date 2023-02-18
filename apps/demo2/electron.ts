import {app, BrowserWindow, Menu} from 'electron';
import path from 'path';

import './generated/ipc-main';
import electronAPI from './electron-api';

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

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => electronAPI.send(mainWindow, 'From Electron'),
          label: 'To Renderer',
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

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
