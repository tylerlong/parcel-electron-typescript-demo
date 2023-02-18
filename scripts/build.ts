import {Parcel} from '@parcel/core';
import {InitialParcelOptions} from '@parcel/types';
import fs from 'fs';
import path from 'path';

const build = async (app: string) => {
  const buildFolder = path.join(__dirname, '..', 'build');
  if(fs.existsSync(buildFolder)) {
    fs.rmSync(buildFolder, {
      recursive: true,
      force: true,
    });
  }
  const commonConfig: InitialParcelOptions = {
    defaultConfig: '@parcel/config-default',
    shouldDisableCache: true,
    mode: 'production',
    defaultTargetOptions: {
      shouldScopeHoist: true,
    },
    additionalReporters: [
      {
        packageName: '@parcel/reporter-cli',
        resolveFrom: __filename,
      },
    ],
    env: {
      NODE_ENV: 'production',
    },
  };

  const config1: InitialParcelOptions = {
    ...commonConfig,
    entries: `apps/${app}/electron.ts`,
    targets: {
      electron: {
        context: 'electron-main',
        distDir: 'build/electron',
      },
    },
  };
  const config2: InitialParcelOptions = {
    ...commonConfig,
    entries: `apps/${app}/generated/preload.ts`,
    targets: {
      preload: {
        context: 'node',
        distDir: 'build/renderer',
      },
    },
  };
  const config3: InitialParcelOptions = {
    ...commonConfig,
    entries: `apps/${app}/index.html`,
    targets: {
      renderer: {
        context: 'browser',
        distDir: 'build/renderer',
        publicUrl: '.',
        engines: {
          browsers: 'last 2 Electron versions',
        },
      },
    },
  };

  for (const config of [config1, config2, config3]) {
    const bundler = new Parcel(config);
    await bundler.run();
  }
};

export default build;
