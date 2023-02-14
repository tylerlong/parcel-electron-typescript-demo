import {Parcel} from '@parcel/core';

const commonConfig = {
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

const config1 = {
  ...commonConfig,
  entries: 'src/electron.ts',
  targets: {
    electron: {
      context: 'electron-main',
      distDir: 'build/electron',
    },
  },
};
const config2 = {
  ...commonConfig,
  entries: 'src/preload.ts',
  targets: {
    preload: {
      context: 'node',
      distDir: 'build/renderer',
    },
  },
};
const config3 = {
  ...commonConfig,
  entries: 'src/index.html',
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
    const bundler = new Parcel(config as any);
    await bundler.run();
  }
};
main();
