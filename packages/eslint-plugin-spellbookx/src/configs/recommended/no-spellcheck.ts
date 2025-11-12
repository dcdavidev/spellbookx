import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';

import configIgnores from '../ignores.js';
import configJavascript from '../javascript.js';
import configJson from '../json.js';
import configMarkdown from '../markdown.js';
import configPrettier from '../prettier.js';

const configRecommendedNoSpellCheck: Linter.Config[] = defineConfig([
  configIgnores,
  configJavascript,
  configJson,
  configMarkdown,
  configPrettier,
]);

export default configRecommendedNoSpellCheck;
