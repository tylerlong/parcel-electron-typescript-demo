import {BrowserWindow, dialog} from 'electron';
import fs from 'fs';
import waitFor from 'wait-for-async';

import BaseElectronAPI from '../../common/base-electron-api';

class ElectronAPI extends BaseElectronAPI {
  async readFile() {
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
  }

  async method2(event, message: string) {
    console.log(message);
    await waitFor({interval: 10});
    return 'done';
  }
}

export default new ElectronAPI();
