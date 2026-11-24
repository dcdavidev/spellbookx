---
'commitlint-config-spellbookx': major
'cz-config-spellbookx': major
'@spellbookx/recipes': patch
---

Use only `czg` for interactive commits, and accept scoped packages in a list of scopes.

- `cz-config-spellbookx`: drop the `commitizen` and `cz-git` dependencies. The preset now imports `definePrompt` and its types from `czg`, which becomes a peer dependency: install `czg` in the project (and globally). Commitizen (`cz` with `config.commitizen.path: "cz-git"`) is no longer supported.
- `commitlint-config-spellbookx`: drop the unused `commitizen` and `cz-git` dependencies. `scope-enum` now splits scopes only on `,`, so `fix(cspell-config-spellbookx,@spellbookx/recipes): …` passes. Before, the `/` of a scoped package name also split the scope and the message was rejected.
- `@spellbookx/recipes`: comments only, no code change.
