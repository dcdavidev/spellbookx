# commitlint-config-spellbookx

## 2.1.0

### Minor Changes

- chore(release): automated minor release bump

### Patch Changes

- Updated dependencies []:
  - @spellbookx/recipes@2.1.0

## 2.0.0

### Major Changes

- [#5](https://github.com/dcdavidev/spellbookx/pull/5) [`c613c79`](https://github.com/dcdavidev/spellbookx/commit/c613c79a2e2640a7abafd6992307cd9ce4171ca8) Thanks [@dcdavidev](https://github.com/dcdavidev)! - Use only `czg` for interactive commits, and accept scoped packages in a list of scopes.

  - `cz-config-spellbookx`: drop the `commitizen` and `cz-git` dependencies. The preset now imports `definePrompt` and its types from `czg`, which becomes a peer dependency: install `czg` in the project (and globally). Commitizen (`cz` with `config.commitizen.path: "cz-git"`) is no longer supported.
  - `commitlint-config-spellbookx`: drop the unused `commitizen` and `cz-git` dependencies. `scope-enum` now splits scopes only on `,`, so `fix(cspell-config-spellbookx,@spellbookx/recipes): …` passes. Before, the `/` of a scoped package name also split the scope and the message was rejected.
  - `@spellbookx/recipes`: comments only, no code change.

### Minor Changes

- [#3](https://github.com/dcdavidev/spellbookx/pull/3) [`e54713c`](https://github.com/dcdavidev/spellbookx/commit/e54713c990899fa94f030d96b6c121a3980df5ad) Thanks [@dcdavidev](https://github.com/dcdavidev)! - Refactor the build, the scripts and the dependencies of every package.

  - Build every package from a shared Rolldown config: `dist/` now mirrors `src/` and runtime dependencies are no longer bundled into the published files.
  - `@spellbookx/recipes`: add `COMMIT_TYPE_DEFINITIONS`, shared by the commitlint and cz-git prompts. Importing `@spellbookx/recipes/git` outside a git repository no longer throws.
  - `cspell-config-spellbookx`: `mergeCSpellConfigs` and `defineSbxConfig` accept arbitrarily nested config arrays in their types.
  - `eslint-plugin-spellbookx`: the ESLint peer dependency is now `^10.4.0` (already required by `eslint-plugin-unicorn`). Remove `eslint-plugin-import`, which registered no rules and does not support ESLint 10, and the unused `eslint-plugin-jsx-a11y`. Update `@eslint-react/eslint-plugin` to v5, `@eslint/json` to v2, `@eslint/markdown` to v9 and `eslint-plugin-unicorn` to v80.
  - `spellbookx`: `sbx init` writes scripts that follow the `action[:target][:modifier]` naming convention: `lint:code`, `lint:code:fix`, `lint:spelling`, `lint:commits` and an aggregate `lint` that only checks (it replaces `lint` with `--fix`, `lint:check`, `spellcheck`, `spellcheck:all` and `commit:lint`).

### Patch Changes

- Updated dependencies [[`c613c79`](https://github.com/dcdavidev/spellbookx/commit/c613c79a2e2640a7abafd6992307cd9ce4171ca8), [`e54713c`](https://github.com/dcdavidev/spellbookx/commit/e54713c990899fa94f030d96b6c121a3980df5ad)]:
  - @spellbookx/recipes@2.0.0

## 1.3.0

### Minor Changes

- chore(release): automated minor release bump

### Patch Changes

- Updated dependencies []:
  - @spellbookx/recipes@1.3.0

## 1.2.0

No changes in this release.

## 1.1.2

### Patch Changes

- chore(release): automated patch release bump

## 1.1.1

### Patch Changes

- chore(release): automated patch release bump

## 1.1.0

### Minor Changes

- chore(release): automated minor release bump

## 1.0.2

### Patch Changes

- chore(release): automated patch release bump

## 1.0.1

No changes in this release.

## 1.0.0

### Major Changes

- [`eff1e5d`](https://github.com/dcdavidev/spellbookx/commit/eff1e5d7a9b485e64dc4dc77d3d9f7dd0352be1a) Thanks [@dcdavidev](https://github.com/dcdavidev)! - New API and major refactor
