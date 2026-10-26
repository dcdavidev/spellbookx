/**
 * @file tools.ts
 * Tool definitions, dependencies, config files, and scripts managed by Spellbookx.
 */

import {
  getHookManagerDependencies,
  getHookManagerFiles,
  getHookManagerScripts,
} from '../lib/hooks.js';
import type {
  ESLintConfigId,
  PrettierConfigId,
  ToolContext,
  ToolDefinition,
  ToolId,
} from '../types/index.js';
import {
  COMMITLINT_CONFIG_TEMPLATE,
  CSPELL_CONFIG_TEMPLATE,
  CSPELL_CUSTOM_DICTIONARY_TEMPLATE,
  CZRC_TEMPLATE,
  EDITORCONFIG_TEMPLATE,
  eslintConfigTemplate,
  PRETTIER_IGNORE_TEMPLATE,
  prettierConfigTemplate,
} from './templates.js';

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
    description: 'React and JSX rules with accessibility checks',
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
 * Supported tools in order of setup execution.
 */
export const TOOLS: ToolDefinition[] = [
  {
    id: 'cspell',
    title: 'CSpell',
    description: 'Multi-language code and identifier spell-checking',
    defaultChecked: true,
    getDependencies: () => [
      '@cspell/cspell-types',
      'cspell',
      'cspell-config-spellbookx',
    ],
    getConfigFiles: () => [
      {
        path: 'cspell.config.cjs',
        content: CSPELL_CONFIG_TEMPLATE,
      },
      {
        path: '.config/cspell/custom-dictionary.txt',
        content: CSPELL_CUSTOM_DICTIONARY_TEMPLATE,
      },
    ],
    getScripts: () => ({
      spellcheck: 'cspell --no-progress --no-summary .',
      'spellcheck:all': 'cspell .',
    }),
  },
  {
    id: 'commitlint',
    title: 'Commitlint & Commitizen',
    description:
      'Conventional Commits enforcement and interactive cz-git prompt',
    defaultChecked: true,
    getDependencies: (context: ToolContext) => [
      '@commitlint/cli',
      '@commitlint/config-conventional',
      '@commitlint/lint',
      '@commitlint/load',
      'commitizen',
      'commitlint-config-spellbookx',
      'conventional-changelog-conventionalcommits',
      ...getHookManagerDependencies(context.choices.hookManager),
    ],
    getConfigFiles: (context: ToolContext) => [
      {
        path: '.czrc',
        content: CZRC_TEMPLATE,
      },
      {
        path: 'commitlint.config.mjs',
        content: COMMITLINT_CONFIG_TEMPLATE,
      },
      ...getHookManagerFiles(
        context.choices.hookManager,
        context.packageManager
      ),
    ],
    getScripts: (context: ToolContext) => ({
      commit: 'cz',
      'commit:lint': 'commitlint --from=HEAD~1',
      ...getHookManagerScripts(context.choices.hookManager),
    }),
    getExtraPackageJson: () => ({
      config: {
        commitizen: {
          path: 'cz-git',
        },
      },
    }),
  },
  {
    id: 'eslint',
    title: 'ESLint',
    description: 'Modern Flat Config with recommended presets & import sorting',
    defaultChecked: true,
    getDependencies: () => [
      'eslint',
      'eslint-plugin-spellbookx',
      '@spellbookx/recipes',
    ],
    getConfigFiles: (context: ToolContext) => [
      {
        path: 'eslint.config.mjs',
        content: eslintConfigTemplate(context.choices.eslintConfig),
      },
    ],
    getScripts: () => ({
      lint: 'eslint --no-warn-ignored --fix .',
      'lint:check': 'eslint --no-warn-ignored .',
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
        path: 'prettier.config.mjs',
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
];

/**
 * Fast lookup map indexed by ToolId.
 */
export const TOOLS_MAP: Record<ToolId, ToolDefinition> = Object.fromEntries(
  TOOLS.map((tool) => [tool.id, tool])
) as Record<ToolId, ToolDefinition>;
