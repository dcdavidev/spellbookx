import chalk from 'chalk';
import { actionCommitlint } from './commitlint.js';
import { actionCspell } from './cspell.js';
import { actionPrettier } from './prettier.js';
import { actionEslint } from './eslint.js';
import { actionVSCode } from './vscode.js';

export async function actionInit() {
  console.log(
    chalk.magenta.bold(
      '\n========================================\n' +
        '  Running Full Spellbookx Setup\n' +
        '========================================\n'
    )
  );

  console.log(
    chalk.cyan(
      'This will initialize all configurations in the following order:\n' +
        '  1. Commitlint\n' +
        '  2. CSpell\n' +
        '  3. Prettier\n' +
        '  4. ESLint\n' +
        '  5. VSCode\n'
    )
  );

  try {
    // Step 1: Commitlint
    console.log(
      chalk.magenta.bold(
        '\n========================================\n' +
          '  [1/5] Commitlint Setup\n' +
          '========================================\n'
      )
    );
    actionCommitlint();

    // Step 2: CSpell
    console.log(
      chalk.magenta.bold(
        '\n========================================\n' +
          '  [2/5] CSpell Setup\n' +
          '========================================\n'
      )
    );
    actionCspell();

    // Step 3: Prettier
    console.log(
      chalk.magenta.bold(
        '\n========================================\n' +
          '  [3/5] Prettier Setup\n' +
          '========================================\n'
      )
    );
    await actionPrettier();

    // Step 4: ESLint
    console.log(
      chalk.magenta.bold(
        '\n========================================\n' +
          '  [4/5] ESLint Setup\n' +
          '========================================\n'
      )
    );
    await actionEslint();

    // Step 5: VSCode
    console.log(
      chalk.magenta.bold(
        '\n========================================\n' +
          '  [5/5] VSCode Setup\n' +
          '========================================\n'
      )
    );
    actionVSCode();

    // Final success message
    console.log(
      chalk.magenta.bold(
        '\n========================================\n' +
          '  All Setup Complete!\n' +
          '========================================\n'
      )
    );
    console.log(
      chalk.green(
        '\n[done] All spellbookx configurations have been initialized successfully!'
      )
    );
    console.log(
      chalk.cyan(
        '\nNext steps:\n' +
          '  - Reload VSCode to apply workspace settings\n' +
          '  - Review generated config files and adjust as needed\n' +
          '  - Run your linters and formatters to verify setup\n'
      )
    );
  } catch (error) {
    console.error(
      chalk.red(
        `\n[error] Setup failed during execution: ${error instanceof Error ? error.message : error}`
      )
    );
    process.exit(1);
  }
}
