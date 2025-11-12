import { type ESLint, type Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import packageJson from 'eslint-plugin-package-json';
import jsoncParser from 'jsonc-eslint-parser';
import json from '@eslint/json';

import configIgnores from './ignores.js';
import configPrettier from './prettier.js';

const configJson: Linter.Config[] = defineConfig([
  configIgnores,

  {
    files: ['**/*.json'],
    plugins: { json: json as ESLint.Plugin },
    language: 'json/json',
    extends: ['json/recommended'],
    languageOptions: { parser: jsoncParser },
    rules: {
      'prettier/prettier': 'off',
    },
  },
  {
    files: ['**/*.json5'],
    plugins: { json: json as ESLint.Plugin },
    language: 'json/json5',
    extends: ['json/recommended'],
    languageOptions: { parser: jsoncParser },
  },
  {
    files: ['**/*.jsonc', '**/tsconfig*.json', '**/.vscode/**/*.json'],
    plugins: { json: json as ESLint.Plugin },
    language: 'json/jsonc',
    extends: ['json/recommended'],
    languageOptions: { parser: jsoncParser },
  },
  {
    files: ['**/package.json'],
    plugins: { json: json as ESLint.Plugin, 'package-json': packageJson },
    language: 'json/json',
    extends: [packageJson.configs.recommended],
    languageOptions: { parser: jsoncParser },
    rules: {
      'package-json/order-properties': 'error',
      'package-json/sort-collections': 'error',
      'package-json/require-description': 'error',
      'package-json/require-bugs': 'error',
      'package-json/require-keywords': 'error',
      'package-json/require-name': 'error',
      'package-json/require-version': 'error',
      'package-json/valid-description': 'error',
      'package-json/valid-license': 'error',
      'package-json/valid-name': 'error',
      'package-json/valid-package-definition': 'error',
      'package-json/valid-version': 'error',
      'prettier/prettier': 'off',
    },
  },

  configPrettier,
]);

export default configJson;
