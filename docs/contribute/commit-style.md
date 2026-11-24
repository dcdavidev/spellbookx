# Commit Message Style

This guide explains how to write commit messages for Spellbookx. Every commit message must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. The rules come from `commitlint-config-spellbookx`, and the interactive prompt comes from `cz-config-spellbookx`. Both packages share the same commit types and scopes.

## Use the czg Prompt

The easiest way to write a valid commit message is the interactive [czg](https://cz-git.qbb.sh/cli/) prompt. `czg` is a dev dependency of the repository, so you do not have to install it. Stage your changes, then run:

```bash
pnpm commit
```

`pnpm cz` and `pnpm czg` are aliases of `pnpm commit`. The command uses the configuration in [`.config/cz.mjs`](../../.config/cz.mjs).

The prompt asks for these values, in this order:

1. The **type** of change.
2. One or more **scopes** (optional).
3. A short **subject**, in the imperative mood.
4. A longer **body** (optional). Type `|` to start a new line.
5. **Breaking changes** (optional, only for `feat` and `fix`).
6. The **issues** that the commit closes (optional).

The prompt then shows the full message and asks you to confirm it.

### Install czg Globally (Optional)

If you prefer to run `czg` directly, install it globally with pnpm:

```bash
pnpm add -g czg
```

or with npm:

```bash
npm i -g czg
```

Run it from the repository root and pass the configuration file:

```bash
czg --config=./.config/cz.mjs
```

## Message Format

```text
<type>(<scope>): <emoji> <subject>

[optional body]

[optional footer(s)]
```

The repository configuration (`.config/cz.mjs`) turns on emojis, so the prompt adds the emoji of the type before the subject. For example:

```text
docs(workspace): 📖 link the contributor guides from CONTRIBUTING.md
```

### Types

| Type       | Emoji | Use it for                                                     |
| :--------- | :---: | :------------------------------------------------------------- |
| `feat`     |  ✨   | A new feature.                                                 |
| `fix`      |  🐛   | A bug fix.                                                     |
| `docs`     |  📖   | Documentation only changes.                                    |
| `style`    |  🎨   | Changes that do not affect the meaning of the code.            |
| `refactor` |  🧹   | A code change that neither fixes a bug nor adds a feature.     |
| `perf`     |  🚀   | A code change that improves performance.                       |
| `test`     |  🧪   | Adding missing tests or correcting existing tests.             |
| `build`    |  📦   | Changes that affect the build system or external dependencies. |
| `ci`       |  🤖   | Changes to the CI configuration files and scripts.             |
| `chore`    |  ♻️   | Other changes that do not modify source or test files.         |
| `revert`   |  🔙   | Reverts a previous commit.                                     |

### Scopes

The scope is optional. The valid scopes are found at runtime from the workspace (`pnpm-workspace.yaml`), so a new package becomes a valid scope automatically:

- The package names: `@spellbookx/recipes`, `commitlint-config-spellbookx`, `cspell-config-spellbookx`, `cz-config-spellbookx`, `eslint-plugin-spellbookx`, `prettier-config-spellbookx` and `spellbookx`.
- `workspace`: files in the repository root, such as config files and the root `package.json`.
- `release`: reserved for the release commits that `dropdx` creates. Do not use it for other commits.

If a commit changes more than one package, list the scopes separated by `,` without spaces:

```text
fix(@spellbookx/recipes,eslint-plugin-spellbookx): 🐛 fix import groups
```

### Rules

Commitlint checks these rules:

- The **type** must be one of the types in the table above.
- Each **scope** must be one of the valid scopes.
- The **subject** must not be empty and must not end with a period.
- The **header** (the first line) has a maximum of 72 characters.
- Each line of the **body** and of the **footer** has a maximum of 100 characters.

Also follow these guidelines:

- Write the subject in the imperative mood: "add", not "added" or "adds".
- Use the body to explain _what_ changed and _why_, not _how_.
- To mark a breaking change, add a `BREAKING CHANGE:` footer that describes the change and how to migrate.
- To close an issue, add a footer such as `closed: #31`.

## Validation

You do not have to check the message by hand:

- The `commit-msg` git hook runs commitlint on every commit. If the message is not valid, the commit is cancelled.
- CI checks every commit message of a pull request.

To check the last commit message manually, run:

```bash
pnpm lint:commits
```

## Commits and Releases

The commit types decide how the packages are versioned. `pnpm changeset:commits` creates changesets from the Conventional Commits of your branch: `feat` commits cause a minor release, `fix` commits cause a patch release, and breaking changes cause a major release. For more information, see the [release process](../CONTRIBUTING.md#release-process).
