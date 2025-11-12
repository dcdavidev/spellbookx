import chalk from 'chalk';
import boxen from 'boxen';
import type { Options } from 'boxen';

const title = chalk.magenta.bold('✨ S P E L L B O O K X ✨');

const boxenOptions: Options = {
  padding: 1,
  margin: 1,
  borderStyle: 'round',
  borderColor: 'magenta',
  backgroundColor: '#555555',
};

console.log(boxen(title, boxenOptions));

console.log(chalk.green('Welcome to the SpellbookX CLI!'));
console.log(chalk.blue('More commands coming soon...'));
