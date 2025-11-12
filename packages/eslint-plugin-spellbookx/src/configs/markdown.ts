import { type ESLint, type Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import markdown from '@eslint/markdown';

import { jsRulesCommon } from '../shared-rules/js-common.js';
import { jsRulesImportsExports } from '../shared-rules/js-imports-exports.js';
import configIgnores from './ignores.js';
import configPrettier from './prettier.js';

const configMarkdown: Linter.Config[] = defineConfig([
  configIgnores,

  {
    files: ['**/*.md'],
    plugins: { markdown: markdown as ESLint.Plugin },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },
  {
    files: ['**/*.md/*.js', '**/*.md/*.ts', '**/*.md/*.jsx', '**/*.md/*.tsx'],
    rules: { ...jsRulesCommon, ...jsRulesImportsExports },
  },

  configPrettier,
]);

export default configMarkdown;
