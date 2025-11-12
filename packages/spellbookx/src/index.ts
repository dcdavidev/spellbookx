#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import boxen from 'boxen';

const cli = new Command();

// Magical banner using boxen
const printMagicalBanner = () => {
  const title = chalk.magenta.bold('✨ S P E L L B O O K X ✨');
  const subtitle = chalk.cyan('A Magical CLI Crafted with Enchantment');
  const punchline = chalk.hex('#9D4EDD')(
    'Crafting magical developer toolchains, automation, environments, and wizards for devs.'
  );

  const content = `${title}\n\n${subtitle}\n\n${punchline}`;

  const box = boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'magenta',
    backgroundColor: 'black',
  });

  console.log(box);
};

// Initialize CLI
cli
  .name('spellbookx')
  .description('🔮 A magical CLI for enchanting your development workflow')
  .version('0.0.1');

// Main command
cli
  .command('cast')
  .description(chalk.magenta('✨ Cast a magical spell'))
  .action(async () => {
    printMagicalBanner();

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'spell',
        message: chalk.cyan('Choose your spell:'),
        choices: [
          chalk.blue('⚡ Lightning Strike'),
          chalk.magenta('💜 Violet Barrier'),
          chalk.blueBright('🌀 Arcane Vortex'),
        ],
      },
      {
        type: 'input',
        name: 'target',
        message: chalk.magenta('Enter your target:'),
        default: 'the realm',
      },
    ]);

    console.log('\n');
    console.log(chalk.magenta.bold('═══════════════════════════════════════'));
    console.log(
      chalk.blue(`✨ Casting ${answers.spell} towards ${answers.target}...`)
    );
    console.log(chalk.magenta.bold('═══════════════════════════════════════'));
    console.log(chalk.hex('#9D4EDD')('✓ Spell cast successfully!\n'));
  });

// Help command with magical flair
cli
  .command('grimoire')
  .description(chalk.magenta('📖 View the grimoire of available spells'))
  .action(() => {
    printMagicalBanner();
    console.log(chalk.blue('Available Incantations:\n'));
    console.log(
      chalk.magenta('  cast        ') + chalk.cyan('Cast a magical spell')
    );
    console.log(
      chalk.magenta('  grimoire    ') + chalk.cyan('View this grimoire')
    );
    console.log(
      chalk.magenta('  help        ') + chalk.cyan('Display help information\n')
    );
  });

// Parse arguments and execute
cli.parse(process.argv);
