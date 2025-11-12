import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import nodeDependencies from 'eslint-plugin-node-dependencies';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';

import { jsRulesCommon } from '../shared-rules/js-common.js';
import { jsRulesImportsExports } from '../shared-rules/js-imports-exports.js';
import { jsDocRules } from '../shared-rules/jsdoc.js';
import configIgnores from './ignores.js';
import configPrettier from './prettier.js';

const configJavascript: Linter.Config[] = defineConfig([
  configIgnores,

  // --- Js/Ts base ---
  {
    files: ['**/*.{js,ts,cjs,cts,mjs,mts}'],
    plugins: {
      jsdoc,
      import: importPlugin,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      nodeDependencies.configs['flat/recommended'],
      unicorn.configs.recommended,
      jsdoc.configs['flat/contents-typescript-flavor'],
      jsdoc.configs['flat/logical-typescript-flavor'],
      jsdoc.configs['flat/requirements-typescript-flavor'],
      jsdoc.configs['flat/stylistic-typescript-flavor'],
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      ...jsRulesCommon,
      ...jsDocRules,
      ...jsRulesImportsExports,
    },
  },

  // --- CommonJS specifics ---
  {
    files: ['**/*.{cjs,cts}', '**/webpack.config.{js,cjs}'],
    languageOptions: {
      globals: { ...globals.commonjs },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'unicorn/prefer-module': 'off',
    },
  },

  // --- Module specifics ---
  {
    files: ['**/*.{js,ts,mjs,mts}'],
    languageOptions: {
      sourceType: 'module',
      globals: { ...globals.es2022 },
    },
  },

  // --- Test files ---
  {
    files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'unicorn/no-null': 'warn',
    },
  },

  configPrettier,
]);

export default configJavascript;
