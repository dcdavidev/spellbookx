import chalk from 'chalk';
import { spawnSync } from 'child_process';
import inquirer from 'inquirer';
import { writeFileSync, existsSync } from 'fs';
import path from 'path';
import { resolvePackageManager } from '../helpers/resolve-package-manager.js';
import {
  dependencies,
  globalDependencies,
} from 'prettier-config-spellbookx/dependencies';
import type { SbxPrettierConfig } from 'prettier-config-spellbookx/types';

const PRESET_IMPORT_NAME: Record<SbxPrettierConfig, string> = {
  base: 'base',
  astro: 'astro',
  'astro-prisma': 'astroPrisma',
  'astro-tailwind': 'astroTailwind',
  'astro-prisma-tailwind': 'astroPrismaTailwind',
};

export async function actionPrettier() {
  console.log(chalk.yellow('Initializing Prettier configuration...'));

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
    chalk.cyan(`\nInstalling global packages: ${globalDependencies.join(', ')}`)
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
    chalk.cyan(`\nInstalling dev dependencies: ${dependencies.join(', ')}`)
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

  // Ask user which preset to use
  const choices: { name: string; value: SbxPrettierConfig }[] = [
    { name: 'base', value: 'base' },
    { name: 'astro', value: 'astro' },
    { name: 'astro-prisma', value: 'astro-prisma' },
    { name: 'astro-tailwind', value: 'astro-tailwind' },
    { name: 'astro-prisma-tailwind', value: 'astro-prisma-tailwind' },
  ];

  const { preset } = await inquirer.prompt<{ preset: SbxPrettierConfig }>([
    {
      type: 'list',
      name: 'preset',
      message: chalk.cyan('Choose a Prettier preset:'),
      choices,
      default: 'base',
    },
  ]);

  // Create prettier.config.mjs
  const cwd = process.cwd();
  const prettierConfigPath = path.join(cwd, 'prettier.config.mjs');
  const importProp = PRESET_IMPORT_NAME[preset];

  const prettierConfig = `import spellbookx from 'prettier-config-spellbookx';

/** @type {import('prettier').Config} */
export default {
  ...spellbookx.${importProp},
};
`;

  console.log(chalk.cyan('\nCreating prettier.config.mjs...'));
  try {
    if (!existsSync(prettierConfigPath)) {
      writeFileSync(prettierConfigPath, prettierConfig, 'utf-8');
      console.log(chalk.green('✓ prettier.config.mjs created successfully.'));
    } else {
      console.log(
        chalk.yellow('⚠ prettier.config.mjs already exists. Skipped')
      );
    }
  } catch (error) {
    console.error(chalk.red(`Failed to create prettier.config.mjs: ${error}`));
    process.exit(1);
  }

  console.log(chalk.magenta('\n✨ Prettier setup complete!'));
}
