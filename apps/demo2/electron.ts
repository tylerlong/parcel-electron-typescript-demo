import {app, BrowserWindow, Menu, MenuItemConstructorOptions} from 'electron';
import path from 'path';
import {newTemplate} from 'electron-application-menu-template';

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

  const template = newTemplate();
  const fileMenu = template.find(item => item.label === 'File')!;
  (fileMenu.submenu! as MenuItemConstructorOptions[]).unshift(
    {
      label: 'To Renderer',
      async click() {
        electronAPI.send(mainWindow, 'From Electron');
      },
    },
    {
      type: 'separator',
    }
  );
  const menu = Menu.buildFromTemplate(template);
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
