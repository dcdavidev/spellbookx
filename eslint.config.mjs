import { defineConfig } from "eslint/config";
import spellbookx from "eslint-plugin-spellbookx"

export default defineConfig([
  ...spellbookx.configs.recommended,
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/pnpm-lock.yaml"],
  },
]);
