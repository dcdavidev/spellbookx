---
'spellbookx': major
---

`sbx init` asks how each tool's config is written, and sets up only czg and Lefthook.

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
