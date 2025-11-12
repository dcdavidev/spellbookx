import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';

import configIgnores from './ignores.js';

const configPrettier: Linter.Config[] = defineConfig([
  configIgnores,
  {
    files: [
      '**/*.js',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx',
      '**/*.mjs',
      '**/*.cjs',
    ],
    rules: {
      'prettier/prettier': 'off',
    },
  },
]);

export default configPrettier;
