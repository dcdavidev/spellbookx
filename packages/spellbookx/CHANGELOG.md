# spellbookx

## 2.1.0

### Minor Changes

- chore(release): automated minor release bump

## 2.0.0

### Major Changes

- [#5](https://github.com/dcdavidev/spellbookx/pull/5) [`c613c79`](https://github.com/dcdavidev/spellbookx/commit/c613c79a2e2640a7abafd6992307cd9ce4171ca8) Thanks [@dcdavidev](https://github.com/dcdavidev)! - `sbx init` asks how each tool's config is written, and sets up only czg and Lefthook.

  - For each selected tool, the wizard asks the config format and, when the format allows both, whether the file goes in `.config/`. It writes only the official file names: a `<tool>.config.<ext>` name goes in the root, and a name that is only the tool name goes in `.config/`.
    - ESLint: `eslint.config.mjs` or `eslint.config.ts` (installs `jiti`).
    - Prettier: `prettier.config.mjs` or `prettier.config.ts`.
    - CSpell: `.config/cspell.yml` / `cspell.config.yml`, `.config/cspell.json` / `cspell.config.json`, or `cspell.config.mjs` with `defineSbxConfig`. The word list moves to `.config/cspell/custom.txt`.
    - commitlint: `.config/commitlint.mjs` or `commitlint.config.mjs`.
    - czg: `.config/cz.mjs` or `cz.config.mjs`.
    - Lefthook: `.config/lefthook.yml`, `.config/lefthook.json`, or `.config/lefthook.toml`.
  - The defaults (and non-interactive runs) give the `.config/` layout. The scripts and hooks pass the path where the tool needs it: `commitlint --config ./.config/commitlint.mjs` and `czg --config=./.config/cz.mjs`.
  - New flags: `--czg`, `--lefthook`, `--eslint-format`, `--prettier-format`, `--cspell-format`, `--lefthook-format`, `--config-dir <tools...>`, and `--root <tools...>`.

  Breaking changes:

  - czg and Lefthook are separate tools. `--commitlint` now sets up commitlint only.
  - Husky is no longer supported: `--hook-manager` and the `.husky/commit-msg` hook are removed. Lefthook is the only hook manager.
  - Commitizen and `cz-git` are no longer supported: the wizard no longer writes `.czrc` or the `package.json` `config.commitizen` block, and no longer installs `commitizen`. It installs `czg` and `cz-config-spellbookx`, and the `commit` script runs `czg`. Also install czg globally: `npm install -g czg`.
  - CSpell is no longer set up with `cspell.config.cjs` and `@cspell/cspell-types`.
  - Programmatic API: `SetupOptions` takes the choices in `choices`, `ResolvedChoices` has new fields, `HookManager`, the `hooks` module, `CSPELL_CONFIG_TEMPLATE`, `CZRC_TEMPLATE`, `huskyCommitMsgTemplate`, and `lefthookTemplate` are removed, and `ConfigFile.mode` and `ToolDefinition.getExtraPackageJson` are removed.

### Minor Changes

- [#3](https://github.com/dcdavidev/spellbookx/pull/3) [`e54713c`](https://github.com/dcdavidev/spellbookx/commit/e54713c990899fa94f030d96b6c121a3980df5ad) Thanks [@dcdavidev](https://github.com/dcdavidev)! - Refactor the build, the scripts and the dependencies of every package.

  - Build every package from a shared Rolldown config: `dist/` now mirrors `src/` and runtime dependencies are no longer bundled into the published files.
  - `@spellbookx/recipes`: add `COMMIT_TYPE_DEFINITIONS`, shared by the commitlint and cz-git prompts. Importing `@spellbookx/recipes/git` outside a git repository no longer throws.
  - `cspell-config-spellbookx`: `mergeCSpellConfigs` and `defineSbxConfig` accept arbitrarily nested config arrays in their types.
  - `eslint-plugin-spellbookx`: the ESLint peer dependency is now `^10.4.0` (already required by `eslint-plugin-unicorn`). Remove `eslint-plugin-import`, which registered no rules and does not support ESLint 10, and the unused `eslint-plugin-jsx-a11y`. Update `@eslint-react/eslint-plugin` to v5, `@eslint/json` to v2, `@eslint/markdown` to v9 and `eslint-plugin-unicorn` to v80.
  - `spellbookx`: `sbx init` writes scripts that follow the `action[:target][:modifier]` naming convention: `lint:code`, `lint:code:fix`, `lint:spelling`, `lint:commits` and an aggregate `lint` that only checks (it replaces `lint` with `--fix`, `lint:check`, `spellcheck`, `spellcheck:all` and `commit:lint`).

## 1.3.0

### Minor Changes

- chore(release): automated minor release bump

## 1.2.0

### Minor Changes

- [#2](https://github.com/dcdavidev/spellbookx/pull/2) [`fdc2f2a`](https://github.com/dcdavidev/spellbookx/commit/fdc2f2af67a7b8a8c90a57818b39166a4f37c599) Thanks [@dcdavidev](https://github.com/dcdavidev)! - Complete the `sbx` CLI initialization flow.

  - `sbx init` (and bare `sbx`) now configures every tool when no option is passed.
  - Added `--cspell`, `--eslint`, `--prettier`, and `--commitlint` flags for single-tool setup, plus `--prettier-config`, `--eslint-config`, and `--hook-manager`.
  - Commitlint setup writes `.czrc`, `commitlint.config.mjs` (with rule documentation), adds the `config.commitizen.path` and `scripts.commit` / `scripts.commit:lint` entries, and configures Lefthook or Husky.
  - Prettier setup writes `prettier.config.mjs` (base or resolved preset), `.prettierignore`, and `.editorconfig`.
  - ESLint setup writes `eslint.config.mjs` for the selected preset.
  - CSpell setup writes `cspell.config.cjs` and a project custom dictionary.
  - The banner is now rendered as ASCII art with `figlet` and `chalk`.

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
