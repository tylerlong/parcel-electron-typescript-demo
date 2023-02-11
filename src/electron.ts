import {app, BrowserWindow, ipcMain, dialog} from 'electron';
import path from 'path';
import fs from 'fs';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../dist/preload/preload.js'),
    },
  });
  mainWindow.loadFile('dist/renderer/index.html');

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

ipcMain.handle('readFile', async () => {
  const r = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow()!, {
    filters: [
      {
        name: 'Text File',
        extensions: ['txt'],
      },
    ],
    properties: ['openFile'],
  });
  if (!r.canceled) {
    return fs.readFileSync(r.filePaths[0], 'utf-8');
  }
  return undefined;
});
