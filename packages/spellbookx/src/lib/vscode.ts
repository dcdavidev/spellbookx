/**
 * @file Builds `.vscode/settings.json` and `.vscode/extensions.json` according
 * to the tools and choices selected during setup.
 */

import type { ConfigFile, ResolvedChoices, ToolId } from '../types/index.js';

/**
 * Options used to build VS Code workspace configuration files.
 */
export interface VSCodeOptions {
  selectedTools: readonly ToolId[];
  choices: ResolvedChoices;
}

/**
 * Base languages validated by ESLint in VS Code.
 */
const BASE_ESLINT_LANGUAGES = [
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
  'json',
  'jsonc',
] as const;

/**
 * Languages configured to use Prettier as their default formatter in VS Code.
 */
const PRETTIER_LANGUAGES = [
  'typescript',
  'typescriptreact',
  'javascript',
  'javascriptreact',
  'json',
  'jsonc',
] as const;

/**
 * Builds the `.vscode/settings.json` object for the selected tools.
 *
 * @param options - Selected tools and resolved configuration choices.
 * @returns Plain settings object, or `null` when no tool defines VS Code settings.
 */
export function buildVSCodeSettings(
  options: VSCodeOptions
): Record<string, unknown> | null {
  const isSelected = (tool: ToolId): boolean =>
    options.selectedTools.includes(tool);
  const settings: Record<string, unknown> = {};

  if (isSelected('prettier')) {
    settings['editor.defaultFormatter'] = 'esbenp.prettier-vscode';
    settings['editor.formatOnSave'] = true;
  }

  if (isSelected('eslint')) {
    settings['editor.codeActionsOnSave'] = {
      'source.fixAll.eslint': 'explicit',
    };

    const validate: string[] = [...BASE_ESLINT_LANGUAGES];
    if (
      options.choices.eslintConfig === 'astro' ||
      options.choices.eslintConfig === 'all'
    ) {
      validate.push('astro');
    }
    if (
      options.choices.eslintConfig === 'svelte' ||
      options.choices.eslintConfig === 'all'
    ) {
      validate.push('svelte');
    }
    settings['eslint.validate'] = validate;
    settings['eslint.workingDirectories'] = [{ mode: 'auto' }];
  }

  if (isSelected('cspell')) {
    settings['cSpell.enabled'] = true;
  }

  if (isSelected('prettier')) {
    for (const language of PRETTIER_LANGUAGES) {
      settings[`[${language}]`] = {
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
      };
    }
  }

  return Object.keys(settings).length > 0 ? settings : null;
}

/**
 * Builds the `.vscode/extensions.json` recommendations list for the selected tools.
 *
 * @param options - Selected tools and resolved configuration choices.
 * @returns Extension recommendations object, or `null` when none apply.
 */
export function buildVSCodeExtensions(
  options: VSCodeOptions
): { recommendations: string[] } | null {
  const isSelected = (tool: ToolId): boolean =>
    options.selectedTools.includes(tool);
  const recommendations = new Set<string>();

  if (isSelected('eslint')) {
    recommendations.add('dbaeumer.vscode-eslint');
  }

  if (isSelected('prettier')) {
    recommendations.add('editorconfig.editorconfig');
    recommendations.add('esbenp.prettier-vscode');
  }

  if (isSelected('commitlint')) {
    recommendations.add('joshbolduc.commitlint');
  }

  if (isSelected('cspell')) {
    recommendations.add('streetsidesoftware.code-spell-checker');
  }

  const hasYamlConfig =
    (isSelected('cspell') && options.choices.cspellFormat === 'yaml') ||
    (isSelected('lefthook') && options.choices.lefthookFormat === 'yaml');
  if (hasYamlConfig) {
    recommendations.add('redhat.vscode-yaml');
  }

  if (recommendations.size === 0) {
    return null;
  }

  return {
    recommendations: [...recommendations].toSorted((a, b) =>
      a.localeCompare(b)
    ),
  };
}

/**
 * Builds the `.vscode/settings.json` and `.vscode/extensions.json` files
 * for the selected tools and configuration choices.
 *
 * @param options - Selected tools and resolved configuration choices.
 * @returns List of VS Code configuration files to write.
 */
export function getVSCodeConfigFiles(options: VSCodeOptions): ConfigFile[] {
  const files: ConfigFile[] = [];

  const settings = buildVSCodeSettings(options);
  if (settings) {
    files.push({
      path: '.vscode/settings.json',
      content: `${JSON.stringify(settings, null, 2)}\n`,
    });
  }

  const extensions = buildVSCodeExtensions(options);
  if (extensions) {
    files.push({
      path: '.vscode/extensions.json',
      content: `${JSON.stringify(extensions, null, 2)}\n`,
    });
  }

  return files;
}
