/**
 * @file lefthook.ts
 * Builds the Lefthook configuration in YAML, JSON, or TOML.
 *
 * Lefthook is the only Git hook manager supported by Spellbookx. Its config
 * file is always written as `.config/lefthook.EXT`, which Lefthook finds by
 * itself (https://lefthook.dev/configuration/).
 */

import type {
  ConfigLocation,
  LefthookFormat,
  PackageManager,
  ToolId,
} from '../types/index.js';
import { getCommitlintConfigArgument } from './config-files.js';

/**
 * Lefthook placeholder resolved to the list of staged files at hook runtime.
 */
const STAGED_FILES = '{staged_files}';

/**
 * Lefthook placeholder resolved to the commit message file path.
 */
const COMMIT_MSG_FILE = '{1}';

/**
 * A Lefthook job. Only string and boolean values are used.
 */
export interface LefthookJob {
  name: string;
  run: string;
  stage_fixed?: boolean;
  fail_text?: string;
}

/**
 * A Lefthook hook with its jobs.
 */
export interface LefthookHook {
  piped?: boolean;
  jobs: LefthookJob[];
}

/**
 * The Lefthook configuration written by the wizard.
 */
export interface LefthookConfig {
  assert_lefthook_installed: boolean;
  'pre-commit'?: LefthookHook;
  'commit-msg'?: LefthookHook;
}

/**
 * Options used to build the Lefthook configuration.
 */
export interface LefthookOptions {
  packageManager: PackageManager;
  selectedTools: readonly ToolId[];
  commitlintLocation: ConfigLocation;
}

/**
 * Builds the Lefthook hooks for the selected tools.
 *
 * - `pre-commit`: ESLint, then Prettier, on the staged files (one after the
 *   other, because both write files).
 * - `commit-msg`: commitlint, with `--config` when its file is in `.config/`.
 *
 * @param options - Package manager, selected tools, and commitlint location.
 * @returns The Lefthook configuration object.
 */
export function buildLefthookConfig(options: LefthookOptions): LefthookConfig {
  const pm = options.packageManager;
  const isSelected = (tool: ToolId): boolean =>
    options.selectedTools.includes(tool);
  const config: LefthookConfig = { assert_lefthook_installed: true };

  const preCommitJobs: LefthookJob[] = [];
  if (isSelected('eslint')) {
    preCommitJobs.push({
      name: 'eslint',
      run: `${pm} exec eslint --no-warn-ignored --fix ${STAGED_FILES}`,
      stage_fixed: true,
    });
  }
  if (isSelected('prettier')) {
    preCommitJobs.push({
      name: 'prettier',
      run: `${pm} exec prettier --ignore-unknown --write ${STAGED_FILES}`,
      stage_fixed: true,
    });
  }
  if (preCommitJobs.length > 0) {
    config['pre-commit'] = { piped: true, jobs: preCommitJobs };
  }

  if (isSelected('commitlint')) {
    config['commit-msg'] = {
      jobs: [
        {
          name: 'commitlint',
          run: `${pm} exec commitlint ${getCommitlintConfigArgument(options.commitlintLocation)}--edit ${COMMIT_MSG_FILE}`,
          fail_text:
            'Use Conventional Commits, for example "feat: add a page".',
        },
      ],
    };
  }

  return config;
}

/**
 * Header comment written at the top of the YAML and TOML files.
 */
const HEADER = `# Lefthook configuration
# Documentation: https://lefthook.dev/configuration/
#
# Skip every hook for one command: LEFTHOOK=0 git commit ...
`;

/**
 * Quotes a YAML scalar with single quotes.
 *
 * @param value - The string to quote.
 * @returns The quoted YAML string.
 */
function yamlString(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

/**
 * Quotes a TOML basic string. JSON string escapes are valid in TOML.
 *
 * @param value - The string to quote.
 * @returns The quoted TOML string.
 */
function tomlString(value: string): string {
  return JSON.stringify(value);
}

/**
 * Formats a job value for YAML or TOML.
 *
 * @param value - The string or boolean value.
 * @param quote - The string quoting function of the target format.
 * @returns The formatted value.
 */
function formatValue(
  value: boolean | string,
  quote: (value: string) => string
): string {
  return typeof value === 'boolean' ? String(value) : quote(value);
}

/**
 * Returns the hooks of the configuration in a stable order.
 *
 * @param config - The Lefthook configuration.
 * @returns Pairs of hook name and hook.
 */
function hookEntries(config: LefthookConfig): [string, LefthookHook][] {
  return (['pre-commit', 'commit-msg'] as const)
    .filter((name) => config[name] !== undefined)
    .map((name) => [name, config[name] as LefthookHook]);
}

/**
 * Serializes the configuration as YAML.
 *
 * @param config - The Lefthook configuration.
 * @returns YAML file content.
 */
function toYaml(config: LefthookConfig): string {
  const lines = [
    HEADER,
    `assert_lefthook_installed: ${config.assert_lefthook_installed}`,
  ];

  for (const [name, hook] of hookEntries(config)) {
    lines.push('', `${name}:`);
    if (hook.piped !== undefined) {
      lines.push(`  piped: ${hook.piped}`);
    }
    lines.push('  jobs:');
    for (const job of hook.jobs) {
      const entries = Object.entries(job) as [string, boolean | string][];
      for (const [index, [key, value]] of entries.entries()) {
        const prefix = index === 0 ? `${' '.repeat(4)}- ` : ' '.repeat(6);
        lines.push(`${prefix}${key}: ${formatValue(value, yamlString)}`);
      }
    }
  }

  return `${lines.join('\n')}\n`;
}

/**
 * Serializes the configuration as TOML.
 *
 * @param config - The Lefthook configuration.
 * @returns TOML file content.
 */
function toToml(config: LefthookConfig): string {
  const lines = [
    HEADER,
    `assert_lefthook_installed = ${config.assert_lefthook_installed}`,
  ];

  for (const [name, hook] of hookEntries(config)) {
    lines.push('', `[${name}]`);
    if (hook.piped !== undefined) {
      lines.push(`piped = ${hook.piped}`);
    }
    for (const job of hook.jobs) {
      lines.push('', `[[${name}.jobs]]`);
      for (const [key, value] of Object.entries(job) as [
        string,
        boolean | string,
      ][]) {
        lines.push(`${key} = ${formatValue(value, tomlString)}`);
      }
    }
  }

  return `${lines.join('\n')}\n`;
}

/**
 * Builds the Lefthook configuration file content in the selected format.
 *
 * @param format - The selected Lefthook format.
 * @param options - Package manager, selected tools, and commitlint location.
 * @returns File content for `.config/lefthook.EXT`.
 */
export function lefthookConfigTemplate(
  format: LefthookFormat,
  options: LefthookOptions
): string {
  const config = buildLefthookConfig(options);

  switch (format) {
    case 'json': {
      return `${JSON.stringify(config, null, 2)}\n`;
    }
    case 'toml': {
      return toToml(config);
    }
    default: {
      return toYaml(config);
    }
  }
}
