import chalk from 'chalk';
import { spawnSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';
import path from 'path';
import { resolvePackageManager } from '../helpers/resolve-package-manager.js';

export function actionCommitlint() {
  console.log(chalk.yellow('Initializing commitlint configuration...'));

  const pm = resolvePackageManager(process.cwd());

  console.log(chalk.green(`Using ${pm} as the package manager.`));

  // Packages to install globally
  const globalPackages = ['commitizen', 'cz-git'];

  // Packages to install as dev dependencies
  const devPackages = [
    'commitizen',
    'cz-git',
    'conventional-changelog-conventionalcommits',
    '@commitlint/cli',
    '@commitlint/config-conventional',
    'commitlint-config-spellbookx',
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

  // Create commitlint.config.mjs
  const cwd = process.cwd();
  const commitlintConfigPath = path.join(cwd, 'commitlint.config.mjs');
  const commitlintConfig = `export default {
  extends: ['commitlint-config-spellbookx'],
};
`;

  console.log(chalk.cyan('\nCreating commitlint.config.mjs...'));
  try {
    writeFileSync(commitlintConfigPath, commitlintConfig, 'utf-8');
    console.log(chalk.green('✓ commitlint.config.mjs created successfully.'));
  } catch (error) {
    console.error(
      chalk.red(`Failed to create commitlint.config.mjs: ${error}`)
    );
    process.exit(1);
  }

  // Create .czrc
  const czrcPath = path.join(cwd, '.czrc');
  const czrcConfig = JSON.stringify({ path: 'cz-git' }, null, 2);

  console.log(chalk.cyan('Creating .czrc...'));
  try {
    writeFileSync(czrcPath, czrcConfig, 'utf-8');
    console.log(chalk.green('✓ .czrc created successfully.'));
  } catch (error) {
    console.error(chalk.red(`Failed to create .czrc: ${error}`));
    process.exit(1);
  }

  // Update package.json with commitizen config
  const packageJsonPath = path.join(cwd, 'package.json');
  console.log(chalk.cyan('Updating package.json...'));
  try {
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
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
      'utf-8'
    );
    console.log(chalk.green('✓ package.json updated successfully.'));
  } catch (error) {
    console.error(chalk.red(`Failed to update package.json: ${error}`));
    process.exit(1);
  }

  console.log(chalk.magenta('\n✨ Commitlint setup complete!'));
}
