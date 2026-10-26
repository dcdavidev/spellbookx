/**
 * @file index.ts
 * Programmatic API and command factory for Spellbookx CLI.
 */

import { Command } from 'commander';

import { runInit } from './commands/init.js';
import { brand, WIZARD_EMOJI } from './constants/theme.js';
import { packageJson } from './lib/package-json.js';
import type {
  ESLintConfigId,
  HookManager,
  PackageManager,
  PrettierConfigId,
  ToolId,
} from './types/index.js';

export * from './commands/index.js';
export * from './constants/index.js';
export * from './lib/index.js';
export * from './types/index.js';

/**
 * Shape of the options parsed from the `init` command (and the default action).
 */
interface InitOptions {
  pm?: PackageManager;
  skipInstall?: boolean;
  tools?: ToolId[];
  cspell?: boolean;
  eslint?: boolean;
  prettier?: boolean;
  commitlint?: boolean;
  prettierConfig?: PrettierConfigId;
  eslintConfig?: ESLintConfigId;
  hookManager?: HookManager;
  interactive?: boolean;
}

/**
 * Translates parsed CLI options into the setup runner options.
 *
 * When none of the tool flags (`--cspell`, `--eslint`, `--prettier`,
 * `--commitlint`) are passed, every tool is selected, so running
 * `sbx init` initializes all configuration files.
 *
 * @param options - Parsed Commander options.
 * @returns Options accepted by {@link runInit}.
 */
function toSetupOptions(options: InitOptions) {
  const toolFlags: [ToolId, boolean | undefined][] = [
    ['cspell', options.cspell],
    ['eslint', options.eslint],
    ['prettier', options.prettier],
    ['commitlint', options.commitlint],
  ];

  const flaggedTools = toolFlags
    .filter(([, enabled]) => enabled)
    .map(([id]) => id);

  const tools =
    options.tools ?? (flaggedTools.length > 0 ? flaggedTools : undefined);

  return {
    packageManager: options.pm,
    skipInstall: options.skipInstall,
    tools,
    prettierConfig: options.prettierConfig,
    eslintConfig: options.eslintConfig,
    hookManager: options.hookManager,
    interactive: options.interactive,
  };
}

/**
 * Registers the shared options for the `init` command and the default action.
 *
 * @param command - The Commander command to attach options to.
 * @returns The same command instance for chaining.
 */
function addInitOptions(command: Command): Command {
  return command
    .option(
      '-p, --pm <packageManager>',
      'Package manager to use (pnpm, npm, yarn, bun)'
    )
    .option(
      '--skip-install',
      'Generate configurations without installing packages'
    )
    .option(
      '-t, --tools <tools...>',
      'Tools to configure (cspell, commitlint, eslint, prettier)'
    )
    .option('--cspell', 'Configure CSpell only')
    .option('--eslint', 'Configure ESLint only')
    .option('--prettier', 'Configure Prettier only')
    .option('--commitlint', 'Configure Commitlint & Commitizen only')
    .option(
      '--prettier-config <config>',
      'Prettier preset to use (base, recommended)'
    )
    .option(
      '--eslint-config <config>',
      'ESLint preset to use (e.g. recommended-spellcheck, strict, all)'
    )
    .option(
      '--hook-manager <manager>',
      'Git hook manager for commitlint (lefthook, husky)'
    )
    .option('-i, --interactive', 'Force interactive prompts');
}

/**
 * Creates and configures the Commander CLI program.
 *
 * @returns Configured Command instance.
 */
export function createProgram(): Command {
  const program = new Command();

  program
    .name('spellbookx')
    .alias('sbx')
    .description(
      `${WIZARD_EMOJI} ${brand('Spellbookx')} developer toolchain CLI`
    )
    .version(packageJson.version)
    // The same options are registered on the root command and on `init`.
    // Without this, Commander parses the subcommand's options against the
    // root command, leaving the `init` action with an empty option object.
    .enablePositionalOptions();

  addInitOptions(
    program.command('init').description('Initialize Spellbookx configurations')
  ).action(async (options: InitOptions) => {
    await runInit(toSetupOptions(options));
  });

  // Default action when running `sbx` or `spellbookx` without subcommands
  addInitOptions(program).action(async (options: InitOptions) => {
    await runInit(toSetupOptions(options));
  });

  return program;
}
