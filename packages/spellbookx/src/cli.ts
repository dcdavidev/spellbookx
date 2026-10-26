#!/usr/bin/env node
/**
 * @file cli.ts
 * Executable entry point for the Spellbookx CLI (`sbx` / `spellbookx`).
 */

import chalk from 'chalk';

import { createProgram } from './index.js';

try {
  await createProgram().parseAsync(process.argv);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(chalk.red(`\n✖ ${message}\n`));
  process.exitCode = 1;
}
