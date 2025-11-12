#!/usr/bin/env node

import { Command } from 'commander';
import { actionCommitlint } from './actions/commitlint.js';
import { actionCspell } from './actions/cspell.js';
import { actionEslint } from './actions/eslint.js';
import { actionPrettier } from './actions/prettier.js';
import { packageJson } from './helpers/package-json.js';

const sbx = new Command();

// Initialize CLI
sbx
  .name(packageJson.name)
  .alias('sbx')
  .description('🔮 A magical CLI for enchanting your development workflow')
  .version(packageJson.version);

// Command init
const init = sbx
  .command('init')
  .description('Initialize spellbookx configurations');

// Command init commitlint
init
  .command('commitlint')
  .description('Initialize commitlint configuration')
  .action(actionCommitlint);

// Command init cspell
init
  .command('cspell')
  .description('Initialize CSpell configuration')
  .action(actionCspell);

// Command init prettier
init
  .command('prettier')
  .description('Initialize Prettier configuration')
  .action(actionPrettier);

// Command init eslint
init
  .command('eslint')
  .description('Initialize ESLint configuration')
  .action(actionEslint);

// Parse arguments
sbx.parse(process.argv);
