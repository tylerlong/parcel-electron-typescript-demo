import {Parcel} from '@parcel/core';
import {InitialParcelOptions} from '@parcel/types';

const app = 'demo1';

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
  entries: `apps/${app}/src/electron.ts`,
  targets: {
    electron: {
      context: 'electron-main',
      distDir: 'build/electron',
    },
  },
};
const config2: InitialParcelOptions = {
  ...commonConfig,
  entries: `apps/${app}/src/preload.ts`,
  targets: {
    preload: {
      context: 'node',
      distDir: 'build/renderer',
    },
  },
};
const config3: InitialParcelOptions = {
  ...commonConfig,
  entries: `apps/${app}/src/index.html`,
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

const main = async () => {
  for (const config of [config1, config2, config3]) {
    const bundler = new Parcel(config);
    await bundler.run();
  }
};
main();
