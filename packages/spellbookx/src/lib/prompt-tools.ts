/**
 * @file Interactive prompts for selecting Spellbookx tools, presets, config
 * file
 * formats, and config file locations.
 */

import { checkbox, confirm, select } from '@inquirer/prompts';

import { brand, brandSecondary } from '../constants/theme.js';
import {
  type ChoiceOption,
  CSPELL_FORMAT_OPTIONS,
  ESLINT_CONFIG_OPTIONS,
  ESLINT_FORMAT_OPTIONS,
  LEFTHOOK_FORMAT_OPTIONS,
  PRETTIER_CONFIG_OPTIONS,
  PRETTIER_FORMAT_OPTIONS,
  TOOLS,
} from '../constants/tools.js';
import type {
  ConfigLocation,
  CSpellFormat,
  ESLintConfigId,
  ESLintFormat,
  LefthookFormat,
  PrettierConfigId,
  PrettierFormat,
  ToolId,
} from '../types/index.js';

/**
 * Prompts the user to select which Spellbookx tools to install and configure.
 *
 * @returns Promise resolving to an array of selected ToolId strings.
 */
export async function promptTools(): Promise<ToolId[]> {
  const selected = await checkbox<ToolId>({
    message: `${brand('Select Spellbookx tools')} ${brandSecondary('to install and configure:')}`,
    choices: TOOLS.map((tool) => ({
      name: tool.title,
      value: tool.id,
      checked: tool.defaultChecked,
      description: tool.description,
    })),
  });

  return selected;
}

/**
 * Shows a single-choice prompt built from choice options.
 *
 * @param subject - What is being chosen, for example "ESLint preset".
 * @param options - The options to choose from.
 * @returns Promise resolving to the selected value.
 */
async function selectOption<T extends string>(
  subject: string,
  options: ChoiceOption<T>[]
): Promise<T> {
  return select<T>({
    message: `${brand('Select the')} ${brandSecondary(subject)} ${brand('to use:')}`,
    choices: options.map((option) => ({
      name: option.title,
      value: option.value,
      description: option.description,
    })),
  });
}

/**
 * Prompts the user to choose a `prettier-config-spellbookx` preset.
 *
 * @returns Promise resolving to the selected PrettierConfigId.
 */
export async function promptPrettierConfig(): Promise<PrettierConfigId> {
  return selectOption('Prettier preset', PRETTIER_CONFIG_OPTIONS);
}

/**
 * Prompts the user to choose the Prettier config file format.
 *
 * @returns Promise resolving to the selected PrettierFormat.
 */
export async function promptPrettierFormat(): Promise<PrettierFormat> {
  return selectOption('Prettier config format', PRETTIER_FORMAT_OPTIONS);
}

/**
 * Prompts the user to choose an `eslint-plugin-spellbookx` preset.
 *
 * @returns Promise resolving to the selected ESLintConfigId.
 */
export async function promptESLintConfig(): Promise<ESLintConfigId> {
  return selectOption('ESLint preset', ESLINT_CONFIG_OPTIONS);
}

/**
 * Prompts the user to choose the ESLint config file format.
 *
 * @returns Promise resolving to the selected ESLintFormat.
 */
export async function promptESLintFormat(): Promise<ESLintFormat> {
  return selectOption('ESLint config format', ESLINT_FORMAT_OPTIONS);
}

/**
 * Prompts the user to choose the CSpell config file format.
 *
 * @returns Promise resolving to the selected CSpellFormat.
 */
export async function promptCSpellFormat(): Promise<CSpellFormat> {
  return selectOption('CSpell config format', CSPELL_FORMAT_OPTIONS);
}

/**
 * Prompts the user to choose the Lefthook config file format.
 *
 * @returns Promise resolving to the selected LefthookFormat.
 */
export async function promptLefthookFormat(): Promise<LefthookFormat> {
  return selectOption('Lefthook config format', LEFTHOOK_FORMAT_OPTIONS);
}

/**
 * Asks whether a config file goes in `.config/` or in the project root.
 *
 * @param configDirPath - The file path used in `.config/`, for example `.config/cz.mjs`.
 * @param rootPath - The file path used in the root, for example `cz.config.mjs`.
 * @returns Promise resolving to the selected ConfigLocation.
 */
export async function promptConfigLocation(
  configDirPath: string,
  rootPath: string
): Promise<ConfigLocation> {
  const useConfigDir = await confirm({
    message: `${brand('Put the file in')} ${brandSecondary('.config/')}${brand('?')} (yes: ${configDirPath}, no: ${rootPath})`,
    default: true,
  });

  return useConfigDir ? 'config-dir' : 'root';
}
