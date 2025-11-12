import chalk from 'chalk';
import { spawnSync } from 'child_process';
import inquirer from 'inquirer';
import { writeFileSync, existsSync, renameSync } from 'fs';
import path from 'path';
import { resolvePackageManager } from '../helpers/resolve-package-manager.js';
import {
  dependencies,
  globalDependencies,
} from 'prettier-config-spellbookx/dependencies';
import type { SbxPrettierConfig } from 'prettier-config-spellbookx/types';

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
  let importProp: string;
  switch (preset) {
    case 'base':
      importProp = 'base';
      break;
    case 'astro':
      importProp = 'astro';
      break;
    case 'astro-prisma':
      importProp = 'astroPrisma';
      break;
    case 'astro-tailwind':
      importProp = 'astroTailwind';
      break;
    case 'astro-prisma-tailwind':
      importProp = 'astroPrismaTailwind';
      break;
    default:
      throw new Error(`Invalid Prettier preset: ${preset}`);
  }

  const prettierConfig = `import spellbookx from 'prettier-config-spellbookx';

/** @type {import('prettier').Config} */
export default {
  ...spellbookx.${importProp},
};
`;

  console.log(chalk.cyan('\n[info] Creating prettier.config.mjs...'));

  try {
    if (!existsSync(prettierConfigPath)) {
      writeFileSync(prettierConfigPath, prettierConfig, 'utf-8');
      console.log(chalk.green('👍 prettier.config.mjs created successfully.'));
    } else {
      const { overwrite } = await inquirer.prompt<{
        overwrite: boolean;
      }>([
        {
          type: 'confirm',
          name: 'overwrite',
          message: chalk.yellow(
            'A prettier.config.mjs already exists. Do you want to overwrite it?'
          ),
          default: false,
        },
      ]);

      if (overwrite) {
        writeFileSync(prettierConfigPath, prettierConfig, 'utf-8');
        console.log(
          chalk.green('[ok] prettier.config.mjs overwritten successfully.')
        );
      } else {
        console.log(chalk.yellow('[warn] Kept existing prettier.config.mjs.'));
      }
    }
  } catch (error) {
    console.error(
      chalk.red(`[error] Failed to create prettier.config.mjs: ${error}`)
    );
    process.exit(1);
  }

  console.log(chalk.magenta('\n[done] Prettier setup complete!'));

  // Create or update .editorconfig with backup
  const editorConfigPath = path.join(cwd, '.editorconfig');
  const editorConfigBakPath = path.join(cwd, '.editorconfig.bak');
  const editorConfigContents = `# EditorConfig is awesome: https://EditorConfig.org

# Top-level EditorConfig
root=true

# Global defaults for all files
[*]
charset=utf-8
end_of_line=lf
insert_final_newline=true
trim_trailing_whitespace=true
indent_style=space
indent_size=2

# Astro
[*.astro]
indent_style=tab
indent_size=4

# Markdown fix
[*.md]
trim_trailing_whitespace=false

# Toml
[*.toml]
max_line_length=100

[Makefile]
indent_style=tab
indent_size=4
`;

  console.log(chalk.cyan('\n[info] Ensuring .editorconfig is present...'));
  try {
    if (existsSync(editorConfigPath)) {
      // If a previous backup exists, rotate it with a timestamp to avoid overwrite
      if (existsSync(editorConfigBakPath)) {
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        const rotated = `${editorConfigBakPath}.${ts}`;
        renameSync(editorConfigBakPath, rotated);
        console.log(
          chalk.yellow(
            `[rotate] Rotated existing .editorconfig.bak to ${path.basename(rotated)}`
          )
        );
      }
      renameSync(editorConfigPath, editorConfigBakPath);
      console.log(
        chalk.green(
          '[backup] Backed up existing .editorconfig to .editorconfig.bak'
        )
      );
    }

    writeFileSync(editorConfigPath, editorConfigContents, 'utf-8');
    console.log(chalk.green('[ok] .editorconfig written successfully.'));
  } catch (error) {
    console.error(
      chalk.red(`[error] Failed to create/update .editorconfig: ${error}`)
    );
    process.exit(1);
  }

  // Create or update .prettierignore with backup
  const prettierIgnorePath = path.join(cwd, '.prettierignore');
  const prettierIgnoreBakPath = path.join(cwd, '.prettierignore.bak');
  const prettierIgnoreContents = `/.astro/\n/.codacy/\n/.gemini/\n/.github/instructions/\n/.nx/\n/bun.lockb\n/czrc\n/eslint.config.mjs\n/prettier.config.mjs\n\n**/dist/\n**/node_modules/\n**/*LICENSE*\n**/*lock.*\n**/*.tsbuildinfo\n`;

  console.log(chalk.cyan('\n[info] Ensuring .prettierignore is present...'));
  try {
    if (existsSync(prettierIgnorePath)) {
      // Rotate old backup if present
      if (existsSync(prettierIgnoreBakPath)) {
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        const rotated = `${prettierIgnoreBakPath}.${ts}`;
        renameSync(prettierIgnoreBakPath, rotated);
        console.log(
          chalk.yellow(
            `[rotate] Rotated existing .prettierignore.bak to ${path.basename(rotated)}`
          )
        );
      }
      renameSync(prettierIgnorePath, prettierIgnoreBakPath);
      console.log(
        chalk.green(
          '[backup] Backed up existing .prettierignore to .prettierignore.bak'
        )
      );
    }

    writeFileSync(prettierIgnorePath, prettierIgnoreContents, 'utf-8');
    console.log(chalk.green('[ok] .prettierignore written successfully.'));
  } catch (error) {
    console.error(
      chalk.red(`[error] Failed to create/update .prettierignore: ${error}`)
    );
    process.exit(1);
  }
}
