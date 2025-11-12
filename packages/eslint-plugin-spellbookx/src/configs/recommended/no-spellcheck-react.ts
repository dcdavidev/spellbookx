import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';

import configIgnores from '../ignores.js';
import configJson from '../json.js';
import configMarkdown from '../markdown.js';
import configPrettier from '../prettier.js';
import configReact from '../react.js';

const configRecommendedNoSpellCheckReact: Linter.Config[] = defineConfig([
  configIgnores,
  configReact,
  configJson,
  configMarkdown,
  configPrettier,
]);

export default configRecommendedNoSpellCheckReact;
