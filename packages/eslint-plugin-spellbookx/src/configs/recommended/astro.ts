import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";

import configAstro from "../astro.js";
import configCSpell from "../cspell.js";
import configIgnores from "../ignores.js";
import configJson from "../json.js";
import configMarkdown from "../markdown.js";
import configPrettier from "../prettier.js";
import configReact from "../react.js";

const configRecommendedAstro: Linter.Config[] = defineConfig([
  configIgnores,
  configCSpell,
  configReact,
  configAstro,
  configJson,
  configMarkdown,
  configPrettier,
]);

export default configRecommendedAstro;
