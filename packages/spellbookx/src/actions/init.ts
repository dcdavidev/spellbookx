import chalk from 'chalk';
import { actionCommitlint } from './commitlint.js';
import { actionCspell } from './cspell.js';
import { actionPrettier } from './prettier.js';
import { actionEslint } from './eslint.js';
import { actionVSCode } from './vscode.js';

function printHeader(step: string, total: string, title: string) {
  console.log(
    chalk.magenta.bold(
      `\n${'='.repeat(40)}\n  [${step}/${total}] ${title}\n${'='.repeat(40)}\n`
    )
  );
}

function printIntro() {
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

function printSuccess() {
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

export async function actionInit() {
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
        `\n[error] Setup failed during execution: ${error instanceof Error ? error.message : error}`
      )
    );
    process.exit(1);
  }
}
