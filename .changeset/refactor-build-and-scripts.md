---
'@spellbookx/recipes': minor
'commitlint-config-spellbookx': minor
'cspell-config-spellbookx': minor
'cz-config-spellbookx': minor
'eslint-plugin-spellbookx': minor
'prettier-config-spellbookx': minor
'spellbookx': minor
---

Refactor the build, the scripts and the dependencies of every package.

- Build every package from a shared Rolldown config: `dist/` now mirrors `src/` and runtime dependencies are no longer bundled into the published files.
- `@spellbookx/recipes`: add `COMMIT_TYPE_DEFINITIONS`, shared by the commitlint and cz-git prompts. Importing `@spellbookx/recipes/git` outside a git repository no longer throws.
- `cspell-config-spellbookx`: `mergeCSpellConfigs` and `defineSbxConfig` accept arbitrarily nested config arrays in their types.
- `eslint-plugin-spellbookx`: the ESLint peer dependency is now `^10.4.0` (already required by `eslint-plugin-unicorn`). Remove `eslint-plugin-import`, which registered no rules and does not support ESLint 10, and the unused `eslint-plugin-jsx-a11y`. Update `@eslint-react/eslint-plugin` to v5, `@eslint/json` to v2, `@eslint/markdown` to v9 and `eslint-plugin-unicorn` to v80.
- `spellbookx`: `sbx init` writes scripts that follow the `action[:target][:modifier]` naming convention: `lint:code`, `lint:code:fix`, `lint:spelling`, `lint:commits` and an aggregate `lint` that only checks (it replaces `lint` with `--fix`, `lint:check`, `spellcheck`, `spellcheck:all` and `commit:lint`).
