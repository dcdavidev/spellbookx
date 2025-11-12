import type { ESLint, Linter } from 'eslint';

import configCSpell from './configs/cspell.js';
import configIgnores from './configs/ignores.js';
import { configRecommendedNoSpellCheckAstro } from './configs/index.js';
import configJavascript from './configs/javascript.js';
import configJson from './configs/json.js';
import configMarkdown from './configs/markdown.js';
import configPrettier from './configs/prettier.js';
import configReact from './configs/react.js';
import configRecommendedAstro from './configs/recommended/astro.js';
import configRecommendedNoSpellCheck from './configs/recommended/no-spellcheck.js';
import configRecommendedNoSpellCheckReact from './configs/recommended/no-spellcheck-react.js';
import configRecommendedReact from './configs/recommended/react.js';
import configRecommended from './configs/recommended/recommended.js';
import type { SbxESLintConfig } from './types.js';
import { packageJson } from './helpers.js';

const configs: Record<SbxESLintConfig, Linter.Config[]> = {
  // global ignores
  ignores: configIgnores,

  // js/ts & react
  javascript: configJavascript,
  react: configReact,

  // json
  json: configJson,

  // markdown
  markdown: configMarkdown,

  // spelling
  cspell: configCSpell,

  // prettier fixes
  prettier: configPrettier,

  // collections
  recommended: configRecommended,
  'recommended-astro': configRecommendedAstro,
  'recommended-react': configRecommendedReact,
  'recommended-no-spellcheck': configRecommendedNoSpellCheck,
  'recommended-no-spellcheck-astro': configRecommendedNoSpellCheckAstro,
  'recommended-no-spellcheck-react': configRecommendedNoSpellCheckReact,
};

type Plugin = ESLint.Plugin & {
  configs: typeof configs;
};

const plugin: Plugin = {
  meta: {
    name: packageJson.name,
    version: packageJson.version,
    namespace: 'spellbookx',
  },
  configs,
  rules: {},
  processors: {},
};

export default plugin;
