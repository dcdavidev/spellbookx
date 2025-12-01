/* eslint-disable unicorn/no-process-exit */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';
import {
  dependencies,
  globalDependencies,
} from 'commitlint-config-spellbookx/dependencies';

import { resolvePackageManager } from '../helpers/resolve-package-manager.js';

/**
 * Initializes and configures commitlint, installs required dependencies, and updates project configuration files.
 * @example
 * // Run this function to set up commitlint in your project
 * actionCommitlint();
 */
export function actionCommitlint() {
  console.log(chalk.yellow('Initializing commitlint configuration...'));

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
    console.error(
      chalk.red(
        `[error] Failed to install global packages: ${globalResult.error.message}`
      )
    );
    process.exit(1);
  }

  if (globalResult.status !== 0) {
    console.error(chalk.red('Global package installation failed.'));
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
    console.error(
      chalk.red(
        `[error] Failed to install dev dependencies: ${devResult.error.message}`
      )
    );
    process.exit(1);
  }

  if (devResult.status !== 0) {
    console.error(chalk.bgRed('Dev dependency installation failed.'));
    process.exit(1);
  }

  console.log(chalk.green('[ok] Dev dependencies installed successfully.'));

  // Create commitlint.config.mjs
  const cwd = process.cwd();
  const commitlintConfigPath = path.join(cwd, 'commitlint.config.mjs');
  const commitlintConfig = `export default {
  extends: ['spellbookx'],
};
`;

  console.log(chalk.cyan('\n[info] Creating commitlint.config.mjs...'));
  try {
    writeFileSync(commitlintConfigPath, commitlintConfig, 'utf8');
    console.log(
      chalk.green('[ok] commitlint.config.mjs created successfully.')
    );
  } catch (error) {
    console.error(
      chalk.red(`[error] Failed to create commitlint.config.mjs: ${error}`)
    );
    process.exit(1);
  }

  // Create .czrc
  const czrcPath = path.join(cwd, '.czrc');
  const czrcConfig = JSON.stringify({ path: 'cz-git' }, null, 2);

  console.log(chalk.cyan('[info] Creating .czrc...'));
  try {
    writeFileSync(czrcPath, czrcConfig, 'utf8');
    console.log(chalk.green('[ok] .czrc created successfully.'));
  } catch (error) {
    console.error(chalk.red(`[error] Failed to create .czrc: ${error}`));
    process.exit(1);
  }

  // Update package.json with commitizen config
  const packageJsonPath = path.join(cwd, 'package.json');
  console.log(chalk.cyan('[info] Updating package.json...'));
  try {
    const packageJsonContent = readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    // Add commitizen config
    packageJson.config = {
      ...packageJson.config,
      commitizen: {
        path: 'git-cz',
      },
    };

    writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
      'utf8'
    );
    console.log(chalk.green('[ok] package.json updated successfully.'));
  } catch (error) {
    console.error(chalk.red(`[error] Failed to update package.json: ${error}`));
    process.exit(1);
  }

  console.log(chalk.magenta('\n[done] Commitlint setup complete!'));
}
