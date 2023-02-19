import {Parcel} from '@parcel/core';
import {InitialParcelOptions} from '@parcel/types';
import fs from 'fs';
import path from 'path';

const build = async (app: string, watch = false) => {
  const buildFolder = path.join(__dirname, '..', 'build');
  if (fs.existsSync(buildFolder)) {
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

  const electronMainConfig: InitialParcelOptions = {
    ...commonConfig,
    entries: `apps/${app}/electron.ts`,
    targets: {
      electron: {
        context: 'electron-main',
        distDir: 'build/electron',
      },
    },
  };
  const preloadConfig: InitialParcelOptions = {
    ...commonConfig,
    entries: `apps/${app}/generated/preload.ts`,
    targets: {
      preload: {
        context: 'node',
        distDir: 'build/renderer',
      },
    },
  };
  const electronRendererConfig: InitialParcelOptions = {
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

  if (watch) {
    const bundler = new Parcel(electronRendererConfig);
    await bundler.watch();
  } else {
    for (const config of [
      electronMainConfig,
      preloadConfig,
      electronRendererConfig,
    ]) {
      const bundler = new Parcel(config);
      await bundler.run();
    }
  }
};

export default build;
