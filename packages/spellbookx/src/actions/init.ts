/* eslint-disable unicorn/no-process-exit */
import chalk from 'chalk';

import { actionCommitlint } from './commitlint.js';
import { actionCspell } from './cspell.js';
import { actionEslint } from './eslint.js';
import { actionPrettier } from './prettier.js';
import { actionVSCode } from './vscode.js';

/**
 * Prints a formatted header for a setup step to the console.
 * This function uses chalk for magenta, bold text formatting.
 * @param {string} step The current step number in the setup process (e.g., '1').
 * @param {string} total The total number of steps in the setup process (e.g., '5').
 * @param {string} title The title or description of the current step (e.g., 'Commitlint Setup').
 * @returns {void}
 *
 * @example
 * // Example usage in the actionInit function:
 * printHeader('1', '5', 'Commitlint Setup');
 */
function printHeader(step: string, total: string, title: string): void {
  console.log(
    chalk.magenta.bold(
      `\n${'='.repeat(40)}\n  [${step}/${total}] ${title}\n${'='.repeat(40)}\n`
    )
  );
}

/**
 * Prints an introductory message for the full Spellbookx setup process.
 * Lists the tools that will be configured and the order of execution.
 * @returns {void}
 *
 * @example
 * // Example usage at the beginning of the setup:
 * printIntro();
 */
function printIntro(): void {
  const divider = '='.repeat(40);
  console.log(
    chalk.magenta.bold(
      `\n${divider}\n  Running Full Spellbookx Setup\n${divider}\n`
    )
  );
  console.log(
    chalk.cyan(
      'This will initialize all configurations in the following order:\n' +
        '  1. Commitlint\n  2. CSpell\n  3. Prettier\n  4. ESLint\n  5. VSCode\n'
    )
  );
}

/**
 * Prints a success message upon successful completion of all setup steps.
 * Also provides a list of suggested next steps for the user.
 * @returns {void}
 *
 * @example
 * // Example usage at the end of a successful setup:
 * printSuccess();
 */
function printSuccess(): void {
  const divider = '='.repeat(40);
  console.log(
    chalk.magenta.bold(`\n${divider}\n  All Setup Complete!\n${divider}\n`)
  );
  const nextSteps =
    '\nNext steps:\n' +
    '  - Reload VSCode to apply workspace settings\n' +
    '  - Review generated config files and adjust as needed\n' +
    '  - Run your linters and formatters to verify setup\n';
  console.log(
    chalk.green(
      '\n[done] All spellbookx configurations have been initialized successfully!'
    )
  );
  console.log(chalk.cyan(nextSteps));
}

/**
 * Executes the full Spellbookx initialization sequence.
 * This runs setup actions for Commitlint, CSpell, Prettier, ESLint, and VSCode
 * in a predefined order. Handles errors and provides feedback via console output.
 * @returns {Promise<void>}
 *
 * @example
 * // To start the full setup process:
 * await actionInit();
 */
export async function actionInit(): Promise<void> {
  printIntro();

  try {
    printHeader('1', '5', 'Commitlint Setup');
    actionCommitlint();

    printHeader('2', '5', 'CSpell Setup');
    actionCspell();

    printHeader('3', '5', 'Prettier Setup');
    await actionPrettier();

    printHeader('4', '5', 'ESLint Setup');
    await actionEslint();

    printHeader('5', '5', 'VSCode Setup');
    actionVSCode();

    printSuccess();
  } catch (error) {
    console.error(
      chalk.red(
        `\n[error] Setup failed during execution: ${
          error instanceof Error ? error.message : error
        }`
      )
    );
    process.exit(1);
  }
}
