import chalk from 'chalk';
import boxen from 'boxen';
import type { Options } from 'boxen';
import { Command } from 'commander';

const program = new Command();

const title = chalk.magenta.bold('✨ S P E L L B O O K X ✨');

const boxenOptions: Options = {
  padding: 1,
  margin: 1,
  borderStyle: 'round',
  borderColor: 'magenta',
  backgroundColor: '#555555',
};

console.log(boxen(title, boxenOptions));

program
  .name('spellbookx')
  .description('CLI for managing spellbookx plugins and configurations')
  .version('0.0.0');

program
  .command('init')
  .description('Initialize spellbookx configurations')
  .command('commitlint')
  .description('Initialize commitlint configuration')
  .action(() => {
    console.log(chalk.yellow('Initializing commitlint configuration...'));
    // TODO: Add actual commitlint initialization logic here
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  console.log(chalk.green('Welcome to the SpellbookX CLI!'));
  console.log(chalk.blue('Use --help to see available commands.'));
}
