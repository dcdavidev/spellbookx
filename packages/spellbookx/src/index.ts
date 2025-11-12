#!/usr/bin/env node

import { Command } from 'commander';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { actionCommitlint } from './actions/commitlint.js';
import { actionCspell } from './actions/cspell.js';

const packagePath = fileURLToPath(new URL('../package.json', import.meta.url));
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8')) as {
  name: string;
  version: string;
};

const sbx = new Command();

// Initialize CLI
sbx
  .name('spellbookx')
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
  .description('Initialize cspell configuration')
  .action(actionCspell);

// Parse arguments
sbx.parse(process.argv);
