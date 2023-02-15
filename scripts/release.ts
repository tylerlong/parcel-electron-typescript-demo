import path from 'path';
import fs from 'fs';

const release = (app: string) => {
  fs.copyFileSync(
    path.join(__dirname, '..', 'common', 'background.png'),
    path.join(__dirname, '..', 'build', 'background.png')
  );
  fs.copyFileSync(
    path.join(__dirname, '..', 'apps', app, 'icon.png'),
    path.join(__dirname, '..', 'build', 'icon.png')
  );
};

export default release;
