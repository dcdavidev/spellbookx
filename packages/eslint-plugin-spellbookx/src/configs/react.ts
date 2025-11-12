import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
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
import configJavascript from './javascript.js';
import configPrettier from './prettier.js';

const configReact: Linter.Config[] = defineConfig([
  configIgnores,
  configJavascript,

  // --- React ---
  {
    files: ['**/*.{jsx,tsx,mjsx,mtsx}'],
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      eslintReact.configs['recommended-typescript'],
      nodeDependencies.configs['flat/recommended'],
      unicorn.configs.recommended,
    ],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
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
    settings: {
      react: { version: 'detect' },
    },
  },

  configPrettier,
]);

export default configReact;
