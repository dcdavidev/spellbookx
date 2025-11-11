import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";

import configCSpell from "../cspell.js";
import configIgnores from "../ignores.js";
import configJavascript from "../javascript.js";
import configJson from "../json.js";
import configMarkdown from "../markdown.js";
import configPrettier from "../prettier.js";

const configRecommended: Linter.Config[] = defineConfig([
  configIgnores,
  configCSpell,
  configJavascript,
  configJson,
  configMarkdown,
  configPrettier,
]);

export default configRecommended;
