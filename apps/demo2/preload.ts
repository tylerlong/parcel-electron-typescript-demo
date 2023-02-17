import {BrowserWindow, dialog} from 'electron';
import fs from 'fs';

class Preload {
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

  async method2(event, ...args: string[]) {
    console.log(args);
    return 'done';
  }
}

export default Preload;
