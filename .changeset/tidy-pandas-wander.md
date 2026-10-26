---
'spellbookx': minor
---

Complete the `sbx` CLI initialization flow.

- `sbx init` (and bare `sbx`) now configures every tool when no option is passed.
- Added `--cspell`, `--eslint`, `--prettier`, and `--commitlint` flags for single-tool setup, plus `--prettier-config`, `--eslint-config`, and `--hook-manager`.
- Commitlint setup writes `.czrc`, `commitlint.config.mjs` (with rule documentation), adds the `config.commitizen.path` and `scripts.commit` / `scripts.commit:lint` entries, and configures Lefthook or Husky.
- Prettier setup writes `prettier.config.mjs` (base or resolved preset), `.prettierignore`, and `.editorconfig`.
- ESLint setup writes `eslint.config.mjs` for the selected preset.
- CSpell setup writes `cspell.config.cjs` and a project custom dictionary.
- The banner is now rendered as ASCII art with `figlet` and `chalk`.
