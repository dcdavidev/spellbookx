# spellbookx

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
