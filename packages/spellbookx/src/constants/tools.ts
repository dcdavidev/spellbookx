/**
 * @file Tool definitions, dependencies, config files, and scripts managed by
 * Spellbookx.
 */

import {
  CSPELL_DICTIONARY_PATH,
  getCommitlintConfigArgument,
  getCommitlintConfigPath,
  getCSpellConfigPath,
  getCzgConfigArgument,
  getCzgConfigPath,
  getESLintConfigPath,
  getLefthookConfigPath,
  getPrettierConfigPath,
} from '../lib/config-files.js';
import { lefthookConfigTemplate } from '../lib/lefthook.js';
import type {
  CSpellFormat,
  ESLintConfigId,
  ESLintFormat,
  LefthookFormat,
  PrettierConfigId,
  PrettierFormat,
  ToolContext,
  ToolDefinition,
  ToolId,
} from '../types/index.js';
import {
  COMMITLINT_CONFIG_TEMPLATE,
  CSPELL_CUSTOM_DICTIONARY_TEMPLATE,
  cspellConfigTemplate,
  CZG_CONFIG_TEMPLATE,
  EDITORCONFIG_TEMPLATE,
  eslintConfigTemplate,
  PRETTIER_IGNORE_TEMPLATE,
  prettierConfigTemplate,
} from './templates.js';

/**
 * A selectable option shown by the interactive prompts.
 */
export interface ChoiceOption<T extends string> {
  value: T;
  title: string;
  description: string;
}

/**
 * ESLint config formats. ESLint finds `eslint.config.*` only in the root.
 */
export const ESLINT_FORMAT_OPTIONS: ChoiceOption<ESLintFormat>[] = [
  {
    value: 'mjs',
    title: 'JavaScript (eslint.config.mjs)',
    description: 'ES module, works with every supported Node.js version',
  },
  {
    value: 'ts',
    title: 'TypeScript (eslint.config.ts)',
    description: 'Also installs jiti, which ESLint needs to load TypeScript',
  },
];

/**
 * Prettier config formats. Prettier finds `prettier.config.*` only in the root.
 */
export const PRETTIER_FORMAT_OPTIONS: ChoiceOption<PrettierFormat>[] = [
  {
    value: 'mjs',
    title: 'JavaScript (prettier.config.mjs)',
    description: 'ES module, works with every supported Node.js version',
  },
  {
    value: 'ts',
    title: 'TypeScript (prettier.config.ts)',
    description:
      'Needs Node.js 22.6+, and --experimental-strip-types before Node.js 24.3',
  },
];

/**
 * CSpell config formats.
 */
export const CSPELL_FORMAT_OPTIONS: ChoiceOption<CSpellFormat>[] = [
  {
    value: 'yaml',
    title: 'YAML (cspell.yml)',
    description: 'Imports cspell-config-spellbookx; .config/ or root',
  },
  {
    value: 'json',
    title: 'JSON (cspell.json)',
    description: 'Imports cspell-config-spellbookx; .config/ or root',
  },
  {
    value: 'mjs',
    title: 'JavaScript with defineSbxConfig (cspell.config.mjs)',
    description: 'Merges your settings into the preset; root only',
  },
];

/**
 * Lefthook config formats. The file always goes in `.config/`.
 */
export const LEFTHOOK_FORMAT_OPTIONS: ChoiceOption<LefthookFormat>[] = [
  {
    value: 'yaml',
    title: 'YAML (.config/lefthook.yml)',
    description: 'The format used in the Lefthook documentation',
  },
  {
    value: 'json',
    title: 'JSON (.config/lefthook.json)',
    description: 'Plain JSON, no comments',
  },
  {
    value: 'toml',
    title: 'TOML (.config/lefthook.toml)',
    description: 'TOML tables for hooks and jobs',
  },
];

/**
 * Prettier presets offered during interactive setup.
 */
export const PRETTIER_CONFIG_OPTIONS: {
  value: PrettierConfigId;
  title: string;
  description: string;
}[] = [
  {
    value: 'base',
    title: 'Base',
    description:
      'Core formatting with plugins for sh, TOML, INI, XML, and more',
  },
  {
    value: 'recommended',
    title: 'Recommended',
    description:
      'Base plus Tailwind class sorting, Astro, Svelte, Prisma, and SQL',
  },
];

/**
 * ESLint presets offered during interactive setup.
 */
export const ESLINT_CONFIG_OPTIONS: {
  value: ESLintConfigId;
  title: string;
  description: string;
}[] = [
  {
    value: 'recommended-spellcheck',
    title: 'Recommended + Spellcheck',
    description: 'Recommended preset with automated CSpell spell-checking',
  },
  {
    value: 'recommended',
    title: 'Recommended',
    description: 'Recommended preset without spell-checking',
  },
  {
    value: 'strict',
    title: 'Strict',
    description: 'Stricter rule set for maximum type and style safety',
  },
  {
    value: 'all',
    title: 'All',
    description: 'Every supported file type, framework, and plugin',
  },
  {
    value: 'base',
    title: 'Base',
    description: 'Minimal JavaScript and TypeScript foundations',
  },
  {
    value: 'javascript',
    title: 'JavaScript',
    description: 'JavaScript-only rules',
  },
  {
    value: 'node',
    title: 'Node.js',
    description: 'Node.js globals and rules',
  },
  {
    value: 'react',
    title: 'React',
    description: 'React and JSX rules for function components and hooks',
  },
  {
    value: 'next',
    title: 'Next.js',
    description: 'Next.js Core Web Vitals rules and next-env.d.ts ignore',
  },
  {
    value: 'astro',
    title: 'Astro',
    description: 'Astro component linting',
  },
  {
    value: 'svelte',
    title: 'Svelte',
    description: 'Svelte component linting',
  },
  {
    value: 'json',
    title: 'JSON',
    description: 'JSON, JSONC, and JSON5 linting',
  },
  {
    value: 'markdown',
    title: 'Markdown',
    description: 'Markdown code fence linting',
  },
];

/**
 * Supported tools in order of setup execution. Lefthook comes last because
 * its hooks depend on the other selected tools.
 */
export const TOOLS: ToolDefinition[] = [
  {
    id: 'cspell',
    title: 'CSpell',
    description: 'Multi-language code and identifier spell-checking',
    defaultChecked: true,
    getDependencies: () => ['cspell', 'cspell-config-spellbookx'],
    getConfigFiles: (context: ToolContext) => [
      {
        path: getCSpellConfigPath(
          context.choices.cspellFormat,
          context.choices.cspellLocation
        ),
        content: cspellConfigTemplate(
          context.choices.cspellFormat,
          context.choices.cspellLocation
        ),
      },
      {
        path: CSPELL_DICTIONARY_PATH,
        content: CSPELL_CUSTOM_DICTIONARY_TEMPLATE,
      },
    ],
    // CSpell finds every generated config file by itself, so no --config flag.
    getScripts: () => ({
      'lint:spelling': 'cspell --no-progress --no-summary .',
    }),
  },
  {
    id: 'commitlint',
    title: 'Commitlint',
    description: 'Conventional Commits enforcement with discovered scopes',
    defaultChecked: true,
    getDependencies: () => [
      '@commitlint/cli',
      '@commitlint/config-conventional',
      'commitlint-config-spellbookx',
      'conventional-changelog-conventionalcommits',
    ],
    getConfigFiles: (context: ToolContext) => [
      {
        path: getCommitlintConfigPath(context.choices.commitlintLocation),
        content: COMMITLINT_CONFIG_TEMPLATE,
      },
    ],
    getScripts: (context: ToolContext) => ({
      'lint:commits': `commitlint ${getCommitlintConfigArgument(context.choices.commitlintLocation)}--from=HEAD~1 --verbose`,
    }),
  },
  {
    id: 'czg',
    title: 'czg',
    description:
      'Interactive Conventional Commits prompt (cz-config-spellbookx)',
    defaultChecked: true,
    getDependencies: () => ['cz-config-spellbookx', 'czg'],
    getConfigFiles: (context: ToolContext) => [
      {
        path: getCzgConfigPath(context.choices.czgLocation),
        content: CZG_CONFIG_TEMPLATE,
      },
    ],
    getScripts: (context: ToolContext) => ({
      commit: `czg${getCzgConfigArgument(context.choices.czgLocation)}`,
    }),
  },
  {
    id: 'eslint',
    title: 'ESLint',
    description: 'Modern Flat Config with recommended presets & import sorting',
    defaultChecked: true,
    getDependencies: (context: ToolContext) => [
      'eslint',
      'eslint-plugin-spellbookx',
      '@spellbookx/recipes',
      ...(context.choices.eslintFormat === 'ts' ? ['jiti'] : []),
    ],
    getConfigFiles: (context: ToolContext) => [
      {
        path: getESLintConfigPath(context.choices.eslintFormat),
        content: eslintConfigTemplate(context.choices.eslintConfig),
      },
    ],
    getScripts: () => ({
      'lint:code': 'eslint --no-warn-ignored .',
      'lint:code:fix': 'eslint --no-warn-ignored --fix .',
    }),
  },
  {
    id: 'prettier',
    title: 'Prettier',
    description: 'Opinionated code formatting + Tailwind CSS class sorting',
    defaultChecked: true,
    getDependencies: () => ['prettier', 'prettier-config-spellbookx'],
    getConfigFiles: (context: ToolContext) => [
      {
        path: getPrettierConfigPath(context.choices.prettierFormat),
        content: prettierConfigTemplate(context.choices.prettierConfig),
      },
      {
        path: '.prettierignore',
        content: PRETTIER_IGNORE_TEMPLATE,
      },
      {
        path: '.editorconfig',
        content: EDITORCONFIG_TEMPLATE,
      },
    ],
    getScripts: () => ({
      fmt: 'prettier --ignore-unknown --write .',
      'fmt:check': 'prettier --ignore-unknown --check .',
    }),
  },
  {
    id: 'lefthook',
    title: 'Lefthook',
    description:
      'Git hooks: ESLint and Prettier on commit, commitlint on message',
    defaultChecked: true,
    getDependencies: () => ['lefthook'],
    getConfigFiles: (context: ToolContext) => [
      {
        path: getLefthookConfigPath(context.choices.lefthookFormat),
        content: lefthookConfigTemplate(context.choices.lefthookFormat, {
          packageManager: context.packageManager,
          selectedTools: context.selectedTools,
          commitlintLocation: context.choices.commitlintLocation,
        }),
      },
    ],
    // Lefthook finds `.config/lefthook.<ext>` by itself.
    getScripts: () => ({ prepare: 'lefthook install' }),
  },
];

/**
 * Fast lookup map indexed by ToolId.
 */
export const TOOLS_MAP: Record<ToolId, ToolDefinition> = Object.fromEntries(
  TOOLS.map((tool) => [tool.id, tool])
) as Record<ToolId, ToolDefinition>;
