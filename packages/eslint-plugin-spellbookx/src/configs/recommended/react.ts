import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';

import configCSpell from '../cspell.js';
import configIgnores from '../ignores.js';
import configJson from '../json.js';
import configMarkdown from '../markdown.js';
import configPrettier from '../prettier.js';
import configReact from '../react.js';

const configRecommendedReact: Linter.Config[] = defineConfig([
  configIgnores,
  configCSpell,
  configReact,
  configJson,
  configMarkdown,
  configPrettier,
]);

export default configRecommendedReact;
