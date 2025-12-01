/* eslint-disable unicorn/no-process-exit */
import { spawnSync } from 'node:child_process';
import { existsSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';
import {
  dependencies,
  globalDependencies,
} from 'eslint-plugin-spellbookx/dependencies';
import type { SbxESLintConfig } from 'eslint-plugin-spellbookx/types';
import inquirer from 'inquirer';

import { resolvePackageManager } from '../helpers/resolve-package-manager.js';

/**
 * Initializes ESLint configuration for the current project, installs required dependencies, and writes a new config file.
 * @example
 * // Run this function to set up ESLint with SpellbookX presets
 * await actionEslint();
 */
export async function actionEslint() {
  console.log(chalk.yellow('Initializing ESLint configuration...'));

  const pm = resolvePackageManager(process.cwd());
  console.log(chalk.green(`Using ${pm} as the package manager.`));

  // Determine install commands based on package manager
  let globalAddCmd: string[];
  let devAddCmd: string[];

  switch (pm) {
    case 'pnpm': {
      globalAddCmd = ['add', '-g', ...globalDependencies];
      devAddCmd = ['add', '-D', ...dependencies];
      break;
    }
    case 'yarn': {
      globalAddCmd = ['global', 'add', ...globalDependencies];
      devAddCmd = ['add', '-D', ...dependencies];
      break;
    }
    case 'bun': {
      globalAddCmd = ['add', '-g', ...globalDependencies];
      devAddCmd = ['add', '-D', ...dependencies];
      break;
    }
    default: {
      globalAddCmd = ['install', '-g', ...globalDependencies];
      devAddCmd = ['install', '-D', ...dependencies];
      break;
    }
  }

  // Install global packages
  console.log(
    chalk.cyan(
      `\n[info] Installing global packages: ${globalDependencies.join(', ')}`
    )
  );
  const globalResult = spawnSync(pm, globalAddCmd, {
    stdio: 'inherit',
    shell: true,
  });

  if (globalResult.error) {
    const msg = `[error] Failed to install global packages: ${globalResult.error.message}`;
    console.error(chalk.red(msg));
    process.exit(1);
  }

  if (globalResult.status !== 0) {
    const msg = 'Global package installation failed.';
    console.error(chalk.red(msg));
    process.exit(1);
  }

  console.log(chalk.green('[ok] Global packages installed successfully.'));

  // Install dev dependencies
  console.log(
    chalk.cyan(
      `\n[info] Installing dev dependencies: ${dependencies.join(', ')}`
    )
  );
  const devResult = spawnSync(pm, devAddCmd, {
    stdio: 'inherit',
    shell: false,
  });

  if (devResult.error) {
    const msg = `[error] Failed to install dev dependencies: ${devResult.error.message}`;
    console.error(chalk.red(msg));
    process.exit(1);
  }

  if (devResult.status !== 0) {
    const msg = 'Dev dependency installation failed.';
    console.error(chalk.bgRed(msg));
    process.exit(1);
  }

  console.log(chalk.green('[ok] Dev dependencies installed successfully.'));

  // Ask user which preset to use
  const choices: { name: string; value: SbxESLintConfig }[] = [
    { name: 'recommended', value: 'recommended' },
    { name: 'recommended-react', value: 'recommended-react' },
    { name: 'recommended-astro', value: 'recommended-astro' },
    { name: 'recommended-no-spellcheck', value: 'recommended-no-spellcheck' },
    {
      name: 'recommended-no-spellcheck-react',
      value: 'recommended-no-spellcheck-react',
    },
    {
      name: 'recommended-no-spellcheck-astro',
      value: 'recommended-no-spellcheck-astro',
    },
    { name: 'javascript', value: 'javascript' },
    { name: 'react', value: 'react' },
    { name: 'json', value: 'json' },
    { name: 'markdown', value: 'markdown' },
    { name: 'cspell', value: 'cspell' },
    { name: 'prettier', value: 'prettier' },
    { name: 'ignores', value: 'ignores' },
  ];

  const { preset } = await inquirer.prompt<{ preset: SbxESLintConfig }>([
    {
      type: 'list',
      name: 'preset',
      message: chalk.cyan('Choose an ESLint preset:'),
      choices,
      default: 'recommended',
    },
  ]);

  // Create eslint.config.mjs
  const cwd = process.cwd();
  const eslintConfigPath = path.join(cwd, 'eslint.config.mjs');

  const eslintConfig = `import spellbookx from 'eslint-plugin-spellbookx';

export default [...spellbookx.configs['${preset}']];
`;

  console.log(chalk.cyan('\n[info] Backing up old ESLint configs (if any)...'));

  // Back up legacy ESLint config files
  const legacyConfigs = [
    '.eslintrc',
    '.eslintrc.json',
    '.eslintrc.yml',
    '.eslintrc.yaml',
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.mjs',
  ];

  for (const filename of legacyConfigs) {
    const p = path.join(cwd, filename);
    try {
      if (existsSync(p)) {
        let backupPath = `${p}.bak`;
        if (existsSync(backupPath)) {
          const ts = new Date().toISOString().replaceAll(/[:.]/g, '-');
          backupPath = `${p}.${ts}.bak`;
        }
        renameSync(p, backupPath);
        console.log(
          chalk.yellow(
            `[backup] Backed up ${filename} -> ${path.basename(backupPath)}`
          )
        );
      }
    } catch (error) {
      console.error(
        chalk.red(`[error] Failed to backup ${filename}: ${error}`)
      );
      // continue processing others; not fatal
    }
  }

  console.log(
    chalk.cyan(
      '\n[info] Writing eslint.config.mjs (will overwrite if present)...'
    )
  );

  try {
    writeFileSync(eslintConfigPath, eslintConfig, 'utf8');
    console.log(chalk.green('[ok] eslint.config.mjs written successfully.'));
  } catch (error) {
    const msg = `[error] Failed to create eslint.config.mjs: ${error}`;
    console.error(chalk.red(msg));
    process.exit(1);
  }

  console.log(chalk.magenta('\n[done] ESLint setup complete!'));
  console.log(
    chalk.cyan(
      '\nRun: npx eslint . to lint your project or add a script to package.json.'
    )
  );
}
