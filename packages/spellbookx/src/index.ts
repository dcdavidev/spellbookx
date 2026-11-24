/**
 * @file index.ts
 * Programmatic API and command factory for Spellbookx CLI.
 */

import { Command, Option } from 'commander';

import { runInit } from './commands/init.js';
import { brand, WIZARD_EMOJI } from './constants/theme.js';
import {
  CSPELL_FORMAT_OPTIONS,
  ESLINT_CONFIG_OPTIONS,
  ESLINT_FORMAT_OPTIONS,
  LEFTHOOK_FORMAT_OPTIONS,
  PRETTIER_CONFIG_OPTIONS,
  PRETTIER_FORMAT_OPTIONS,
  TOOLS,
} from './constants/tools.js';
import { packageJson } from './lib/package-json.js';
import type {
  CSpellFormat,
  ESLintConfigId,
  ESLintFormat,
  LefthookFormat,
  PackageManager,
  PrettierConfigId,
  PrettierFormat,
  ResolvedChoices,
  SetupOptions,
  ToolId,
} from './types/index.js';

export * from './commands/index.js';
export * from './constants/index.js';
export * from './lib/index.js';
export * from './types/index.js';

/**
 * Tools whose config file can go either in `.config/` or in the root.
 */
const LOCATION_TOOLS = ['cspell', 'commitlint', 'czg'] as const;

type LocationTool = (typeof LOCATION_TOOLS)[number];

/**
 * Shape of the options parsed from the `init` command (and the default action).
 */
interface InitOptions {
  pm?: PackageManager;
  skipInstall?: boolean;
  tools?: ToolId[];
  cspell?: boolean;
  commitlint?: boolean;
  czg?: boolean;
  eslint?: boolean;
  prettier?: boolean;
  lefthook?: boolean;
  prettierConfig?: PrettierConfigId;
  prettierFormat?: PrettierFormat;
  eslintConfig?: ESLintConfigId;
  eslintFormat?: ESLintFormat;
  cspellFormat?: CSpellFormat;
  lefthookFormat?: LefthookFormat;
  root?: LocationTool[];
  configDir?: LocationTool[];
  interactive?: boolean;
}

/**
 * Translates parsed CLI options into the setup runner options.
 *
 * When none of the tool flags are passed, every tool is selected, so running
 * `sbx init` initializes all configuration files.
 *
 * @param options - Parsed Commander options.
 * @returns Options accepted by {@link runInit}.
 */
export function toSetupOptions(options: InitOptions): SetupOptions {
  const flaggedTools = TOOLS.map((tool) => tool.id).filter(
    (id) => options[id] === true
  );

  const tools =
    options.tools ?? (flaggedTools.length > 0 ? flaggedTools : undefined);

  const choices: Partial<ResolvedChoices> = {
    prettierConfig: options.prettierConfig,
    prettierFormat: options.prettierFormat,
    eslintConfig: options.eslintConfig,
    eslintFormat: options.eslintFormat,
    cspellFormat: options.cspellFormat,
    lefthookFormat: options.lefthookFormat,
  };

  const locationKeys: Record<LocationTool, keyof ResolvedChoices> = {
    cspell: 'cspellLocation',
    commitlint: 'commitlintLocation',
    czg: 'czgLocation',
  };
  // `--root` wins when a tool is passed to both options.
  const configDirTools = options.configDir ?? [];
  const rootTools = options.root ?? [];
  for (const tool of configDirTools) {
    Object.assign(choices, { [locationKeys[tool]]: 'config-dir' });
  }
  for (const tool of rootTools) {
    Object.assign(choices, { [locationKeys[tool]]: 'root' });
  }

  return {
    packageManager: options.pm,
    skipInstall: options.skipInstall,
    tools,
    choices,
    interactive: options.interactive,
  };
}

/**
 * Lists the values of choice options, for Commander's `choices()`.
 *
 * @param options - The choice options.
 * @returns The `value` of each option, in order.
 */
function values<T extends string>(options: { value: T }[]): T[] {
  return options.map((option) => option.value);
}

/**
 * Registers the shared options for the `init` command and the default action.
 *
 * @param command - The Commander command to attach options to.
 * @returns The same command instance for chaining.
 */
function addInitOptions(command: Command): Command {
  const toolIds = TOOLS.map((tool) => tool.id);

  command
    .addOption(
      new Option('-p, --pm <packageManager>', 'Package manager to use').choices(
        ['pnpm', 'npm', 'yarn', 'bun']
      )
    )
    .option(
      '--skip-install',
      'Generate configurations without installing packages'
    )
    .addOption(
      new Option('-t, --tools <tools...>', 'Tools to configure').choices(
        toolIds
      )
    );

  for (const tool of TOOLS) {
    command.option(`--${tool.id}`, `Configure ${tool.title}`);
  }

  return command
    .addOption(
      new Option('--eslint-config <config>', 'ESLint preset').choices(
        values(ESLINT_CONFIG_OPTIONS)
      )
    )
    .addOption(
      new Option(
        '--eslint-format <format>',
        'ESLint config format (eslint.config.<format>, root)'
      ).choices(values(ESLINT_FORMAT_OPTIONS))
    )
    .addOption(
      new Option('--prettier-config <config>', 'Prettier preset').choices(
        values(PRETTIER_CONFIG_OPTIONS)
      )
    )
    .addOption(
      new Option(
        '--prettier-format <format>',
        'Prettier config format (prettier.config.<format>, root)'
      ).choices(values(PRETTIER_FORMAT_OPTIONS))
    )
    .addOption(
      new Option('--cspell-format <format>', 'CSpell config format').choices(
        values(CSPELL_FORMAT_OPTIONS)
      )
    )
    .addOption(
      new Option(
        '--lefthook-format <format>',
        'Lefthook config format (.config/lefthook.<ext>)'
      ).choices(values(LEFTHOOK_FORMAT_OPTIONS))
    )
    .addOption(
      new Option(
        '--config-dir <tools...>',
        'Put these configs in .config/ (cspell.yml, commitlint.mjs, cz.mjs)'
      ).choices([...LOCATION_TOOLS])
    )
    .addOption(
      new Option(
        '--root <tools...>',
        'Put these configs in the root (cspell.config.*, commitlint.config.mjs, cz.config.mjs)'
      ).choices([...LOCATION_TOOLS])
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
