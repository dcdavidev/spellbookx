/**
 * @file prompt-tools.ts
 * Interactive prompts for selecting Spellbookx tools and their presets.
 */

import { checkbox, select } from '@inquirer/prompts';

import { brand, brandSecondary } from '../constants/theme.js';
import {
  ESLINT_CONFIG_OPTIONS,
  PRETTIER_CONFIG_OPTIONS,
  TOOLS,
} from '../constants/tools.js';
import type {
  ESLintConfigId,
  HookManager,
  PrettierConfigId,
  ToolId,
} from '../types/index.js';
import { HOOK_MANAGERS } from './hooks.js';

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
 * Prompts the user to choose a `prettier-config-spellbookx` preset.
 *
 * @returns Promise resolving to the selected PrettierConfigId.
 */
export async function promptPrettierConfig(): Promise<PrettierConfigId> {
  return select<PrettierConfigId>({
    message: `${brand('Select the')} ${brandSecondary('Prettier preset')} ${brand('to use:')}`,
    choices: PRETTIER_CONFIG_OPTIONS.map((option) => ({
      name: option.title,
      value: option.value,
      description: option.description,
    })),
  });
}

/**
 * Prompts the user to choose an `eslint-plugin-spellbookx` preset.
 *
 * @returns Promise resolving to the selected ESLintConfigId.
 */
export async function promptESLintConfig(): Promise<ESLintConfigId> {
  return select<ESLintConfigId>({
    message: `${brand('Select the')} ${brandSecondary('ESLint preset')} ${brand('to use:')}`,
    choices: ESLINT_CONFIG_OPTIONS.map((option) => ({
      name: option.title,
      value: option.value,
      description: option.description,
    })),
  });
}

/**
 * Prompts the user to choose which Git hook manager to configure.
 *
 * @returns Promise resolving to the selected HookManager.
 */
export async function promptHookManager(): Promise<HookManager> {
  return select<HookManager>({
    message: `${brand('Select the')} ${brandSecondary('Git hook manager')} ${brand('to use:')}`,
    choices: HOOK_MANAGERS.map((option) => ({
      name: option.title,
      value: option.value,
      description: option.description,
    })),
  });
}
