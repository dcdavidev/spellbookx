import chalk from 'chalk';
import { spawnSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { resolvePackageManager } from '../helpers/resolve-package-manager.js';

export function actionCspell() {
  console.log(chalk.yellow('Initializing cspell configuration...'));

  const pm = resolvePackageManager(process.cwd());

  console.log(chalk.green(`Using ${pm} as the package manager.`));

  // Packages to install globally
  const globalPackages = ['cspell'];

  // Packages to install as dev dependencies
  const devPackages = [
    'cspell',
    '@cspell/cspell-types',
    'cspell-config-spellbookx',
  ];

  // Determine install commands based on package manager
  let globalAddCmd: string[];
  let devAddCmd: string[];

  switch (pm) {
    case 'pnpm':
      globalAddCmd = ['add', '-g', ...globalPackages];
      devAddCmd = ['add', '-D', ...devPackages];
      break;
    case 'yarn':
      globalAddCmd = ['global', 'add', ...globalPackages];
      devAddCmd = ['add', '-D', ...devPackages];
      break;
    case 'bun':
      globalAddCmd = ['add', '-g', ...globalPackages];
      devAddCmd = ['add', '-D', ...devPackages];
      break;
    case 'npm':
    default:
      globalAddCmd = ['install', '-g', ...globalPackages];
      devAddCmd = ['install', '-D', ...devPackages];
      break;
  }

  // Install global packages
  console.log(
    chalk.cyan(`\nInstalling global packages: ${globalPackages.join(', ')}`)
  );
  const globalResult = spawnSync(pm, globalAddCmd, {
    stdio: 'inherit',
    shell: false,
  });

  if (globalResult.error) {
    console.error(
      chalk.red(
        `Failed to install global packages: ${globalResult.error.message}`
      )
    );
    process.exit(1);
  }

  if (globalResult.status !== 0) {
    console.error(chalk.red('Global package installation failed.'));
    process.exit(1);
  }

  console.log(chalk.green('✓ Global packages installed successfully.'));

  // Install dev dependencies
  console.log(
    chalk.cyan(`\nInstalling dev dependencies: ${devPackages.join(', ')}`)
  );
  const devResult = spawnSync(pm, devAddCmd, {
    stdio: 'inherit',
    shell: false,
  });

  if (devResult.error) {
    console.error(
      chalk.red(
        `Failed to install dev dependencies: ${devResult.error.message}`
      )
    );
    process.exit(1);
  }

  if (devResult.status !== 0) {
    console.error(chalk.red('Dev dependency installation failed.'));
    process.exit(1);
  }

  console.log(chalk.green('✓ Dev dependencies installed successfully.'));

  // Create .cspell directory
  const cwd = process.cwd();
  const cspellDir = path.join(cwd, '.cspell');

  console.log(chalk.cyan('\nCreating .cspell directory...'));
  try {
    if (!existsSync(cspellDir)) {
      mkdirSync(cspellDir, { recursive: true });
      console.log(chalk.green('✓ .cspell directory created successfully.'));
    } else {
      console.log(chalk.yellow('⚠ .cspell directory already exists.'));
    }
  } catch (error) {
    console.error(chalk.red(`Failed to create .cspell directory: ${error}`));
    process.exit(1);
  }

  // Create custom-words.txt
  const customWordsPath = path.join(cspellDir, 'custom-words.txt');

  console.log(chalk.cyan('Creating .cspell/custom-words.txt...'));
  try {
    if (!existsSync(customWordsPath)) {
      writeFileSync(customWordsPath, '', 'utf-8');
      console.log(
        chalk.green('✓ .cspell/custom-words.txt created successfully.')
      );
    } else {
      console.log(chalk.yellow('⚠ .cspell/custom-words.txt already exists.'));
    }
  } catch (error) {
    console.error(
      chalk.red(`Failed to create .cspell/custom-words.txt: ${error}`)
    );
    process.exit(1);
  }

  // Create cspell.config.cjs
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

  console.log(chalk.cyan('Creating cspell.config.cjs...'));
  try {
    if (!existsSync(cspellConfigPath)) {
      writeFileSync(cspellConfigPath, cspellConfig, 'utf-8');
      console.log(chalk.green('✓ cspell.config.cjs created successfully.'));
    } else {
      console.log(chalk.yellow('⚠ cspell.config.cjs already exists.'));
    }
  } catch (error) {
    console.error(chalk.red(`Failed to create cspell.config.cjs: ${error}`));
    process.exit(1);
  }

  console.log(chalk.magenta('\n✨ CSpell setup complete!'));
  console.log(
    chalk.cyan(
      "\nRun: npx cspell lint '**/*.{ts,js,tsx,jsx,md}' to check your files."
    )
  );
}
