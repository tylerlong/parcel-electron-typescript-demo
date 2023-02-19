import parse from './parse';
import build from './build';
import {run} from './utils';
import release from './release';
import generate from './generate';

const execute = async (app: string, command: string) => {
  switch (command) {
    case 'generate': {
      await generate(app);
      break;
    }
    case 'build': {
      await generate(app);
      await build(app);
      break;
    }
    case 'watch': {
      await build(app, true);
      break;
    }
    case 'start': {
      await generate(app);
      await build(app);
      await run('yarn', 'electron', '.');
      break;
    }
    case 'release': {
      await generate(app);
      await build(app);
      await release(app);
      break;
    }
    default: {
      throw new Error(`Unknown command, ${command}`);
    }
  }
};

const {app, command} = parse();
execute(app, command);
