/**
 * @file Official configuration file names and locations for every tool.
 *
 * Naming rule:
 *
 * - A `TOOL.config.EXT` name always goes in the project root.
 * - A name that is only the tool name (`cspell.yml`, `commitlint.mjs`,
 *   `cz.mjs`, `lefthook.yml`) goes in `.config/`. It is used only for tools
 *   whose CLI accepts a `--config` flag or finds `.config/` by itself.
 */

import type {
  ConfigLocation,
  CSpellFormat,
  ESLintFormat,
  LefthookFormat,
  PrettierFormat,
  ResolvedChoices,
} from '../types/index.js';

/**
 * Directory holding the configuration files named only after their tool.
 */
export const CONFIG_DIR = '.config';

/**
 * Project word list used by the generated CSpell configuration.
 */
export const CSPELL_DICTIONARY_PATH: string = `${CONFIG_DIR}/cspell/custom.txt`;

/**
 * Default choices, used for every choice that is not passed explicitly when
 * the wizard is not interactive. They produce the `.config/` layout.
 */
export const DEFAULT_CHOICES: ResolvedChoices = {
  prettierConfig: 'base',
  prettierFormat: 'mjs',
  eslintConfig: 'recommended-spellcheck',
  eslintFormat: 'mjs',
  cspellFormat: 'yaml',
  cspellLocation: 'config-dir',
  commitlintLocation: 'config-dir',
  czgLocation: 'config-dir',
  lefthookFormat: 'yaml',
};

/**
 * Returns the ESLint flat config file name. ESLint looks for it only in the
 * project root.
 *
 * @param format - The selected format.
 * @returns `eslint.config.mjs` or `eslint.config.ts`.
 */
export function getESLintConfigPath(format: ESLintFormat): string {
  return `eslint.config.${format}`;
}

/**
 * Returns the Prettier config file name. Prettier looks for it only in the
 * project root (and parent directories).
 *
 * @param format - The selected format.
 * @returns `prettier.config.mjs` or `prettier.config.ts`.
 */
export function getPrettierConfigPath(format: PrettierFormat): string {
  return `prettier.config.${format}`;
}

/**
 * Whether the CSpell format can be written both in `.config/` and in the
 * project root. CSpell finds `.config/cspell.yml` and `.config/cspell.json` by
 * itself, but not a JavaScript file named only `cspell.mjs`.
 *
 * @param format - The selected CSpell format.
 * @returns True when the user can choose the location.
 */
export function canChooseCSpellLocation(format: CSpellFormat): boolean {
  return format !== 'mjs';
}

/**
 * Returns the CSpell config file path for the format and location.
 *
 * @param format - The selected format.
 * @param location - The selected location (ignored for `mjs`, always root).
 * @returns The path relative to the project root.
 */
export function getCSpellConfigPath(
  format: CSpellFormat,
  location: ConfigLocation
): string {
  if (format === 'mjs') {
    return 'cspell.config.mjs';
  }

  const extension = format === 'yaml' ? 'yml' : 'json';
  return location === 'config-dir'
    ? `${CONFIG_DIR}/cspell.${extension}`
    : `cspell.config.${extension}`;
}

/**
 * Returns the commitlint config file path. commitlint does not look in
 * `.config/`, so a file there must be passed with `--config`.
 *
 * @param location - The selected location.
 * @returns `.config/commitlint.mjs` or `commitlint.config.mjs`.
 */
export function getCommitlintConfigPath(location: ConfigLocation): string {
  return location === 'config-dir'
    ? `${CONFIG_DIR}/commitlint.mjs`
    : 'commitlint.config.mjs';
}

/**
 * Returns the czg config file path. czg does not look in `.config/`, so a
 * file there must be passed with `--config=PATH`.
 *
 * @param location - The selected location.
 * @returns `.config/cz.mjs` or `cz.config.mjs`.
 */
export function getCzgConfigPath(location: ConfigLocation): string {
  return location === 'config-dir' ? `${CONFIG_DIR}/cz.mjs` : 'cz.config.mjs';
}

/**
 * Returns the Lefthook config file path. Lefthook finds files named only
 * `lefthook.EXT` in `.config/` by itself.
 *
 * @param format - The selected format.
 * @returns `.config/lefthook.yml`, `.config/lefthook.json`, or `.config/lefthook.toml`.
 */
export function getLefthookConfigPath(format: LefthookFormat): string {
  const extension = format === 'yaml' ? 'yml' : format;
  return `${CONFIG_DIR}/lefthook.${extension}`;
}

/**
 * Formats a project-relative path for a command line flag.
 *
 * @param relativePath - Path relative to the project root.
 * @returns The path prefixed with `./`.
 */
export function toCommandPath(relativePath: string): string {
  return `./${relativePath}`;
}

/**
 * Returns the commitlint `--config` argument, or an empty string when the
 * config file is in the root (where commitlint finds it by itself).
 *
 * @param location - The selected commitlint location.
 * @returns The argument followed by a space, or an empty string.
 */
export function getCommitlintConfigArgument(location: ConfigLocation): string {
  return location === 'config-dir'
    ? `--config ${toCommandPath(getCommitlintConfigPath(location))} `
    : '';
}

/**
 * Returns the czg `--config=` argument, or an empty string when the config
 * file is in the root. czg ignores `--config PATH` with a space, so the
 * argument always uses `=`.
 *
 * @param location - The selected czg location.
 * @returns The argument preceded by a space, or an empty string.
 */
export function getCzgConfigArgument(location: ConfigLocation): string {
  return location === 'config-dir'
    ? ` --config=${toCommandPath(getCzgConfigPath(location))}`
    : '';
}

/**
 * Fills the missing choices with the defaults and fixes combinations that
 * the naming rule does not allow (a CSpell `mjs` file always goes in root).
 *
 * @param choices - The explicit or prompted choices.
 * @returns The complete, consistent choices.
 */
export function normalizeChoices(
  choices: Partial<ResolvedChoices> = {}
): ResolvedChoices {
  // Ignore explicit `undefined` values, for example unset CLI options.
  const defined = Object.fromEntries(
    Object.entries(choices).filter(([, value]) => value !== undefined)
  ) as Partial<ResolvedChoices>;
  const resolved: ResolvedChoices = { ...DEFAULT_CHOICES, ...defined };

  if (!canChooseCSpellLocation(resolved.cspellFormat)) {
    resolved.cspellLocation = 'root';
  }

  return resolved;
}
