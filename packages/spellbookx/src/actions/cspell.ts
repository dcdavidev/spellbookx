import chalk from 'chalk';
import { spawnSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, renameSync } from 'fs';
import path from 'path';
import { resolvePackageManager } from '../helpers/resolve-package-manager.js';
import {
  dependencies,
  globalDependencies,
} from 'cspell-config-spellbookx/dependencies';

export function actionCspell() {
  console.log(chalk.yellow('Initializing cspell configuration...'));

  const pm = resolvePackageManager(process.cwd());

  console.log(chalk.green(`Using ${pm} as the package manager.`));

  // Determine install commands based on package manager
  let globalAddCmd: string[];
  let devAddCmd: string[];

  switch (pm) {
    case 'pnpm':
      globalAddCmd = ['add', '-g', ...globalDependencies];
      devAddCmd = ['add', '-D', ...dependencies];
      break;
    case 'yarn':
      globalAddCmd = ['global', 'add', ...globalDependencies];
      devAddCmd = ['add', '-D', ...dependencies];
      break;
    case 'bun':
      globalAddCmd = ['add', '-g', ...globalDependencies];
      devAddCmd = ['add', '-D', ...dependencies];
      break;
    case 'npm':
    default:
      globalAddCmd = ['install', '-g', ...globalDependencies];
      devAddCmd = ['install', '-D', ...dependencies];
      break;
  }

  // Install global packages
  console.log(
    chalk.cyan(
      `\n[info] Installing global packages: ${globalDependencies.join(', ')}`
    )
  );
  const globalResult = spawnSync(pm, globalAddCmd, {
    stdio: 'inherit',
    shell: false,
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

  // Create .cspell directory
  const cwd = process.cwd();
  const cspellDir = path.join(cwd, '.cspell');

  console.log(chalk.cyan('\n[info] Creating .cspell directory...'));
  try {
    if (!existsSync(cspellDir)) {
      mkdirSync(cspellDir, { recursive: true });
      console.log(chalk.green('[ok] .cspell directory created successfully.'));
    } else {
      console.log(chalk.yellow('[warn] .cspell directory already exists.'));
    }
  } catch (error) {
    console.error(
      chalk.red(`[error] Failed to create .cspell directory: ${error}`)
    );
    process.exit(1);
  }

  // Create custom-words.txt
  const customWordsPath = path.join(cspellDir, 'custom-words.txt');

  console.log(chalk.cyan('[info] Creating .cspell/custom-words.txt...'));
  try {
    if (!existsSync(customWordsPath)) {
      writeFileSync(customWordsPath, '', 'utf-8');
      console.log(
        chalk.green('[ok] .cspell/custom-words.txt created successfully.')
      );
    } else {
      console.log(
        chalk.yellow('[warn] .cspell/custom-words.txt already exists.')
      );
    }
  } catch (error) {
    console.error(
      chalk.red(`[error] Failed to create .cspell/custom-words.txt: ${error}`)
    );
    process.exit(1);
  }

  // Remove any other CSpell config files to avoid conflicts
  const possibleConfigs = [
    'cspell.json',
    'cspell.yaml',
    'cspell.yml',
    '.cspell.json',
    '.cspell.yaml',
    '.cspell.yml',
    'cspell.config.json',
    'cspell.config.yaml',
    'cspell.config.yml',
    'cspell.config.js',
    'cspell.config.mjs',
  ];

  console.log(
    chalk.cyan('\n[info] Backing up other CSpell config files (if any)...')
  );
  for (const filename of possibleConfigs) {
    const p = path.join(cwd, filename);
    try {
      if (existsSync(p)) {
        let backupPath = `${p}.bak`;
        if (existsSync(backupPath)) {
          backupPath = `${p}.${Date.now()}.bak`;
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

  // Create (or overwrite) cspell.config.cjs as the single source of truth
  const cspellConfigPath = path.join(cwd, 'cspell.config.cjs');
  const cspellConfig = `const { defineConfig } = require('@cspell/cspell-types');

module.exports = defineConfig({
  version: '0.2',
  import: ['cspell-config-spellbookx'],
  words: [],
  dictionaryDefinitions: [
    {
      name: 'custom-words',
      path: './.cspell/custom-words.txt',
      addWords: true,
    },
  ],
  dictionaries: ['custom-words'],
});
`;

  console.log(
    chalk.cyan(
      '[info] Writing cspell.config.cjs (will overwrite if present)...'
    )
  );

  try {
    writeFileSync(cspellConfigPath, cspellConfig, 'utf-8');
    console.log(chalk.green('[ok] cspell.config.cjs written successfully.'));
  } catch (error) {
    console.error(
      chalk.red(`[error] Failed to create cspell.config.cjs: ${error}`)
    );
    process.exit(1);
  }

  console.log(chalk.magenta('\n[done] CSpell setup complete!'));
  console.log(
    chalk.cyan(
      "\nRun: npx cspell lint '**/*.{ts,js,tsx,jsx,md}' to check your files."
    )
  );
}
