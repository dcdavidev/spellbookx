import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";

import configAstro from "../astro.js";
import configIgnores from "../ignores.js";
import configJson from "../json.js";
import configMarkdown from "../markdown.js";
import configPrettier from "../prettier.js";
import configReact from "../react.js";

const configRecommendedNoSpellCheckAstro: Linter.Config[] = defineConfig([
  configIgnores,
  configReact,
  configAstro,
  configJson,
  configMarkdown,
  configPrettier,
]);

export default configRecommendedNoSpellCheckAstro;
