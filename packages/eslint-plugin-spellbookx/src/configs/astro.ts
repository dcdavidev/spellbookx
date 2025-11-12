import astroParser from 'astro-eslint-parser';
import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import importPlugin from 'eslint-plugin-import';
import nodeDependencies from 'eslint-plugin-node-dependencies';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';

import { jsRulesCommon } from '../shared-rules/js-common.js';
import { jsRulesImportsExports } from '../shared-rules/js-imports-exports.js';
import configIgnores from './ignores.js';
import configPrettier from './prettier.js';

const configAstro: Linter.Config[] = defineConfig([
  configIgnores,

  // --- Astro ---
  {
    files: [
      '**/*.astro',
      '**/*.astro/*.js',
      '**/*.astro/*.ts',
      '**/*.astro/*.jsx',
      '**/*.astro/*.tsx',
    ],
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...astro.configs['flat/recommended'],
      eslintReact.configs['recommended-typescript'],
      nodeDependencies.configs['flat/recommended'],
      unicorn.configs.recommended,
    ],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2022,
      },
      parser: astroParser,
      parserOptions: {
        parser: tseslint.parser,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Common rules
      ...jsRulesCommon,
      ...jsRulesImportsExports,

      // Unicorn
      'unicorn/filename-case': 'off',

      // Prettier
      'prettier/prettier': 'error',
    },
  },

  // --- Prettier ---
  configPrettier,
]);

export default configAstro;
