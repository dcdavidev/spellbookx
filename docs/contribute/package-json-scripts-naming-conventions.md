# Package.json Scripts Naming Conventions

Every script in the `scripts` field of a `package.json` in this repository follows one grammar:

```text
action[:target][:modifier]
```

- **action**: what the script does. One verb or a short, well-known name: `build`, `changeset`, `fmt`, `lint`, `release`, `test`, `update`.
- **target** (optional): what the action runs on, for example `code`, `types`, `spelling`, `commits` or `turbo`.
- **modifier** (optional): how the action runs. The modifier always comes last.

Segments are separated by `:`. Words inside a segment are separated by `-`.

The full convention lives in the [npm script naming conventions gist](https://gist.github.com/dcdavidev/d3e7722932b87e2cd37843417603bc9b). This page applies it to the Spellbookx monorepo.

## Modifiers

| Modifier | Meaning                                                       |
| -------- | ------------------------------------------------------------- |
| `check`  | Report problems and change nothing. Exits non-zero on errors. |
| `fix`    | Apply automatic fixes.                                        |

The bare action has the behaviour that people expect from it:

- `lint` only checks. Fixes are always opt-in with `:fix` (for example `lint:code:fix`).
- `fmt` writes the formatted files. `fmt:check` only checks, for CI.

## Rules

1. **Full words in targets.** Write `commits`, not `cm`; `spelling`, not `spell`.
2. **Group related scripts under one action.** All checks that read the code without changing it are `lint:*`: `lint:code`, `lint:spelling`, `lint:types`, `lint:commits`. Do not add separate top-level names such as `spellcheck`, `typecheck` or `commit:lint`.
3. **An aggregate script runs every script in its group.** `lint` runs `lint:code`, `lint:spelling` and `lint:types` (commit messages are checked by the `commit-msg` hook and by CI).
4. **Do not shadow pnpm built-ins.** `pnpm publish` and `pnpm version` are built-in commands, so the release scripts are `release` and `changeset:version`. A script name must work with the short form `pnpm <name>`.
5. **No catch-all `check` script.** CI runs `build`, `lint:code`, `lint:spelling`, `fmt:check`, `lint:types` and `test` directly, as separate steps (see [`.github/workflows/code-quality-and-tests.yml`](../../.github/workflows/code-quality-and-tests.yml)).
6. **Files in `scripts/` take the name of the script that runs them**, with `-` in place of `:`.
7. **Keep the `scripts` field sorted alphabetically.**

## Named exceptions

These scripts do not follow the grammar, because the names are conventions of their own:

- `build`, `test`: the standard names that tools expect.
- `clean`: removes build outputs and caches.
- `prepare`: an npm lifecycle script. It installs the git hooks.
- `commit`: runs the guided commit prompt (`pnpm exec czg`). `cz` and `czg` are aliases that call `pnpm commit`.
- `test:watch`: runs the tests in watch mode.

## Root scripts

| Script              | What it does                                                            |
| ------------------- | ----------------------------------------------------------------------- |
| `build`             | Builds every package with Rolldown and `tsc` (`turbo run build`).       |
| `changeset`         | Creates a changeset interactively.                                      |
| `changeset:commits` | Creates changesets from the Conventional Commits of the current branch. |
| `changeset:version` | Consumes the changesets, bumps the versions and updates the changelogs. |
| `clean`             | Removes the `.turbo` caches and the `dist/` folders.                    |
| `commit`            | Guided commit (Conventional Commits).                                   |
| `cz`, `czg`         | Aliases of `commit`.                                                    |
| `fmt`               | Formats all files.                                                      |
| `fmt:check`         | Checks formatting and changes nothing.                                  |
| `lint`              | Runs `lint:code`, `lint:spelling` and `lint:types`.                     |
| `lint:code`         | Checks the source code with ESLint.                                     |
| `lint:code:fix`     | Checks the source code and applies automatic fixes.                     |
| `lint:commits`      | Checks the last commit message.                                         |
| `lint:spelling`     | Checks spelling with CSpell.                                            |
| `lint:types`        | Type-checks the sources and the tests of every package.                 |
| `prepare`           | Installs the git hooks.                                                 |
| `release`           | Versions, builds, commits, tags and publishes the packages (`dropdx`).  |
| `test`              | Runs the tests once (`turbo run test`).                                 |
| `test:watch`        | Runs the tests in watch mode.                                           |
| `update:turbo`      | Updates Turborepo and applies its codemods.                             |

Pass extra flags after the script name, for example `pnpm build --force` to bypass the Turborepo cache.

## Package scripts

Every package in `packages/*` defines the same three scripts:

| Script       | What it does                                                  |
| ------------ | ------------------------------------------------------------- |
| `build`      | Bundles `src/` with Rolldown and emits the type declarations. |
| `lint:types` | Type-checks `src/` and `__tests__/` without emitting files.   |
| `test`       | Runs the package tests once with Vitest.                      |

## Scripts generated by the CLI

`sbx init` writes scripts that follow the same convention into the target project:

| Tool       | Scripts                                                   |
| ---------- | --------------------------------------------------------- |
| ESLint     | `lint:code`, `lint:code:fix`                              |
| CSpell     | `lint:spelling`                                           |
| Commitlint | `commit`, `lint:commits`                                  |
| Lefthook   | `prepare`                                                 |
| Prettier   | `fmt`, `fmt:check`                                        |
| All        | `lint` (runs every `lint:<target>` except `lint:commits`) |

## Adding a script

1. Pick the action. Reuse an existing one if it fits.
2. Add a target in full words if the action can run on more than one thing.
3. Add `check` or `fix` only if the script has a variant with that behaviour.
4. If the script runs a file, put it in `scripts/` and name it after the script.
5. If the group has an aggregate (`lint`, `release`), make sure the aggregate runs the new script.
