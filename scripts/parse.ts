import fs from 'fs';
import path from 'path';
import {Command} from 'commander';

const apps = fs
  .readdirSync(path.join(__dirname, '..', 'apps'))
  .filter(name => !name.startsWith('.'));
const commands = ['build', 'start', 'release'];

const parse = () => {
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
  return {app, command};
};

export default parse;
