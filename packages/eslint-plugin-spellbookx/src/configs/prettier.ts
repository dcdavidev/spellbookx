import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";
import prettierRecommended from "eslint-plugin-prettier/recommended";

import configIgnores from "./ignores.js";

const configPrettier: Linter.Config[] = defineConfig([
  configIgnores,
  prettierRecommended,
]);

export default configPrettier;
