import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import cspell from '@cspell/eslint-plugin/configs';

import configIgnores from './ignores.js';
import configPrettier from './prettier.js';

const configCSpell: Linter.Config[] = defineConfig([
  configIgnores,
  cspell.recommended,
  configPrettier,
]);

export default configCSpell;
