#!/usr/bin/env node

import { Command } from 'commander';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const packagePath = fileURLToPath(new URL('../package.json', import.meta.url));
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8')) as {
  name: string;
  version: string;
};

const cli = new Command();

// Initialize CLI
cli
  .name('spellbookx')
  .alias('sbx')
  .description('🔮 A magical CLI for enchanting your development workflow')
  .version(packageJson.version);
