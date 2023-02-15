import {Parcel} from '@parcel/core';
import {InitialParcelOptions} from '@parcel/types';
import path from 'path';
import fs from 'fs';
import {Command} from 'commander';
import {run} from './utils';

const apps = fs
  .readdirSync(path.join(__dirname, 'apps'))
  .filter(name => !name.startsWith('.'));

const commands = ['build', 'start', 'release'];

const program = new Command();
program
  .option('-a --app <app>', 'app to manage')
  .option('-c --command <command>', 'command to run');
program.parse(process.argv);
let {app, command} = program.opts();
if (app && app.length > 2) {
  app = apps.find(item => item.includes(app));
}
if (command && command.length > 2) {
  command = commands.find(item => item.includes(command));
}

const build = async (app: string) => {
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

  for (const config of [config1, config2, config3]) {
    const bundler = new Parcel(config);
    await bundler.run();
  }
};

const runCommand = async (command: string, app: string) => {
  switch (command) {
    case 'build': {
      await build(app);
      break;
    }
    case 'start': {
      await build(app);
      await run('yarn', 'electron', '.');
      break;
    }
    default: {
      throw new Error(`Unknown command, ${command}`);
    }
  }
};
runCommand(command, app);
