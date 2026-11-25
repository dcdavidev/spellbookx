# Contributing to Spellbookx

Thank you for your interest in contributing to **Spellbookx**! 🧙✨

This document outlines the guidelines, development setup, code standards, and workflows required to contribute to the Spellbookx monorepo.

---

## Table of Contents

- [Security Policy](#security-policy)
- [Contributor Guides](#contributor-guides)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Monorepo Architecture](#monorepo-architecture)
- [Development Workflow](#development-workflow)
- [Commit Conventions & Git Hooks](#commit-conventions--git-hooks)
- [Testing Guidelines](#testing-guidelines)
- [Creating a Pull Request](#creating-a-pull-request)
- [Release Process](#release-process)
- [Automated Maintenance](#automated-maintenance)

---

## Security Policy

For vulnerability reporting, please see our [Security Policy](./SECURITY.md).

---

## Contributor Guides

This page is the entry point. The guides in [`docs/contribute/`](./contribute/) cover each topic in depth:

| Guide                                                                                              | What it covers                                                                             |
| :------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| [Development Environment](./contribute/development-environment.md)                                 | Required tools (Node.js, pnpm), cloning, installation, and editor setup.                   |
| [Architecture](./contribute/architecture.md)                                                       | Design principles, package topology, config placement, build pipeline, CI, and automation. |
| [Code Conventions](./contribute/code-conventions.md)                                               | TypeScript, ESM, `@file` header, Prettier formatting, ESLint rules, and spell-checking.    |
| [Commit Message Style](./contribute/commit-style.md)                                               | Conventional Commits format, `czg` prompt, scopes, and Commitlint rules.                   |
| [Package.json Scripts Naming Conventions](./contribute/package-json-scripts-naming-conventions.md) | Naming grammar and reference for every script in `package.json`.                           |
| [Tests](./contribute/tests.md)                                                                     | Running Vitest, coverage reports, and conventions for writing new tests.                   |

---

## Prerequisites

Before contributing, make sure your development environment meets the following requirements:

- **Node.js**: version `26.x` (pinned in [`.nvmrc`](../.nvmrc)).
- **pnpm**: version `12.x` (pinned in the `packageManager` field of the root [`package.json`](../package.json)). Install it as described in the [pnpm installation guide](https://pnpm.io/installation):

```bash
npx get-pnpm
```

For the full setup, see [Development Environment](./contribute/development-environment.md).

---

## Getting Started

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/ < your-username > /spellbookx.git
   cd spellbookx
   ```

2. **Ensure correct Node.js version:**

   ```bash
   nvm use
   ```

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

   > **Note**: Running `pnpm install` automatically configures Git hooks using [Lefthook](https://github.com/evilmartians/lefthook) via [`.config/lefthook.yml`](../.config/lefthook.yml).

4. **Build all packages:**

   ```bash
   pnpm build
   ```

---

## Monorepo Architecture

Spellbookx is organized as a pnpm monorepo managed with [Turborepo](https://turborepo.com/):

```text
spellbookx/
├── .agents/skills/                    # AI Agent skills for developer assistants
├── .changeset/                        # Changesets configuration & lockstep release intents
├── .config/                           # Tool configs without `.config.` in the name (cspell, dropdx, lefthook)
├── .github/                           # CI checks, scheduled update workflows, Dependabot, PR/issue templates
├── .vscode/                           # Recommended VS Code extensions and workspace settings
├── docs/                              # Contributing guide, contributor guides & security policy
├── packages/
│   ├── commitlint-config-spellbookx/  # Conventional Commits rules + scopes
│   ├── cspell-config-spellbookx/      # CSpell multi-language & tech dictionaries
│   ├── cz-config-spellbookx/          # czg interactive commit prompt configuration
│   ├── eslint-plugin-spellbookx/      # ESLint flat configs (17 presets)
│   ├── prettier-config-spellbookx/    # Prettier configs (19 presets + composer)
│   ├── recipes/                       # Shared import sorting, ignore globs & git recipes
│   └── spellbookx/                    # 🧙 The Spellbookx CLI (`sbx`)
├── scripts/                           # Maintenance scripts (`update-node.ts`, `update-turbo.ts`)
├── commitlint.config.mjs              # Commitlint preset configuration
├── cz.config.mjs                      # Interactive `czg` commit prompt configuration
├── eslint.config.mjs                  # ESLint flat config (`recommended-spellcheck`)
├── pnpm-workspace.yaml                # Workspace package mappings, build allow-list, and hoisting rules
├── prettier.config.mjs                # Prettier base preset configuration
├── tsconfig.base.json                 # Shared base TypeScript compiler options
├── tsconfig.json                      # Root TypeScript configuration for `scripts/`
└── turbo.json                         # Turborepo task pipeline configuration
```

Each package has its own `tsconfig.json` (extending `../../tsconfig.base.json`, covering `src/` and `tests/`) and `tsconfig.build.json` (emitting JS, `.d.ts` declarations, and source maps into `dist/`).

For the design principles and the dependency graph between packages, see [Architecture](./contribute/architecture.md).

---

## Development Workflow

### Useful Commands

Script names follow the `action[:target][:modifier]` convention described in [Package.json Scripts Naming Conventions](./contribute/package-json-scripts-naming-conventions.md).

| Command              | Description                                                                                                                  |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| `pnpm build`         | Compiles all packages with TypeScript (`tsc -p tsconfig.build.json`) via Turborepo.                                          |
| `pnpm check`         | Type-checks root `scripts/` and runs `build`, `lint:code`, `lint:spelling`, `lint:types`, `fmt:check`, and `test` via Turbo. |
| `pnpm clean`         | Removes `dist/`, `coverage/`, and `.turbo/` directories across all workspace packages (`turbo run clean`).                   |
| `pnpm dev`           | Runs TypeScript watch builds concurrently across packages (`turbo run dev`).                                                 |
| `pnpm test`          | Runs unit tests with V8 coverage across all packages using Vitest (`turbo run test`).                                        |
| `pnpm lint`          | Runs `lint:code` and `lint:spelling` via Turborepo.                                                                          |
| `pnpm lint:code`     | Lints JavaScript, TypeScript, JSON, and Markdown with ESLint.                                                                |
| `pnpm lint:code:fix` | Lints and applies automatic ESLint fixes.                                                                                    |
| `pnpm lint:commits`  | Checks the last commit message with Commitlint.                                                                              |
| `pnpm lint:spelling` | Runs CSpell across the entire codebase.                                                                                      |
| `pnpm lint:types`    | Type-checks root `scripts/` and the sources and tests of every package (`tsc --noEmit && turbo run lint:types`).             |
| `pnpm fmt`           | Formats all code files using Prettier.                                                                                       |
| `pnpm fmt:check`     | Verifies code formatting with Prettier without writing.                                                                      |
| `pnpm update:node`   | Syncs `.nvmrc` and `@types/node` across the workspace with the latest active Node.js LTS release.                            |
| `pnpm update:turbo`  | Upgrades `turbo` and runs `@turbo/codemod` migrations.                                                                       |

Add `--force` to Turborepo commands to bypass the local cache, for example `pnpm exec turbo run test --force`.

### Targeting Specific Packages

You can run commands for an individual package using pnpm's `--filter` option:

```bash
# Build only the CLI package
pnpm --filter spellbookx build

# Run tests only for the ESLint plugin
pnpm --filter eslint-plugin-spellbookx test

# Run Vitest in watch mode for a single package
pnpm --filter spellbookx exec vitest

# Add a dependency to a specific package
pnpm --filter @spellbookx/recipes add <package-name>
```

### Code Conventions

Every source and script file starts with a JSDoc `@file` header. Lint and formatting rules come from the project's own `eslint-plugin-spellbookx` and `prettier-config-spellbookx`. See [Code Conventions](./contribute/code-conventions.md).

---

## Commit Conventions & Git Hooks

We strictly enforce the [Conventional Commits](https://www.conventionalcommits.org/) specification using `commitlint-config-spellbookx`.

### Commit Message Format

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Scopes**: discovered at runtime from the workspace packages, plus two special scopes:
  - the package names: `@spellbookx/recipes`, `commitlint-config-spellbookx`, `cspell-config-spellbookx`, `cz-config-spellbookx`, `eslint-plugin-spellbookx`, `prettier-config-spellbookx`, `spellbookx`
  - `workspace`: root files, such as config files, `scripts/`, and the root `package.json`
  - `release`: reserved for release commits
  - Separate multiple scopes with `,`.
- **Subject line**: the header has a maximum of 72 characters, and the subject must not end with a period. Use the imperative mood.

### Interactive Commits

To ensure your commit conforms to the rules, use the built-in interactive commit prompt powered by `czg`:

```bash
git add <files>
pnpm commit
```

For more details, see [Commit Message Style](./contribute/commit-style.md).

### Git Hooks with Lefthook

When you commit, [Lefthook](https://github.com/evilmartians/lefthook) (configured in [`.config/lefthook.yml`](../.config/lefthook.yml)) runs:

1. **Pre-commit** (piped): runs `eslint --no-warn-ignored --fix` and then `prettier --ignore-unknown --write` on staged files, automatically re-staging fixed files.
2. **Commit-msg**: validates the commit message format with Commitlint.

---

## Testing Guidelines

- Every new feature, utility function, or bug fix must be accompanied by unit tests.
- Place tests in a `tests/` directory located at the root of the respective package.
- Keep test files split, focused, and named after the module under test (e.g., `banner.test.ts`, `detect-pm.test.ts`).
- Ensure all tests and coverage pass with:

```bash
pnpm test
```

For more details, see [Tests](./contribute/tests.md).

---

## Creating a Pull Request

1. **Create a topic branch:**

   ```bash
   git checkout -b feat/my-new-feature
   ```

2. **Make your changes:**
   - Adhere to existing code conventions and atomic modular architecture.
   - Preserve comments, JSDocs, and type annotations.
   - If introducing new words or technical terms, add them to [`.config/cspell/custom.txt`](../.config/cspell/custom.txt).

3. **Verify everything passes:**

   ```bash
   pnpm check
   ```

4. **Add a changeset** if the change affects a published package:

   ```bash
   pnpm changeset:commits
   ```

5. **Commit your changes using Conventional Commits:**

   ```bash
   git add .
   pnpm commit
   ```

6. **Push your branch and open a Pull Request:**

   ```bash
   git push origin feat/my-new-feature
   ```

7. **PR Review:**
   - Fill in the [pull request template](../.github/PULL_REQUEST_TEMPLATE.md).
   - Clearly explain the problem solved or the feature added.
   - Reference any relevant GitHub issues.
   - CI ([`.github/workflows/code-quality-tests-build.yml`](../.github/workflows/code-quality-tests-build.yml)) must pass.

---

## Release Process

Releases are driven by [Changesets](https://github.com/changesets/changesets) and published with [`dropdx`](https://github.com/dcdavidev/dropdx):

1. **`pnpm changeset`**: Creates a changeset describing your change.
2. **`pnpm changeset:commits`**: Creates changesets automatically from Conventional Commits.
3. **`pnpm changeset:version`**: Consumes the changesets, bumps package versions in lockstep, and updates the changelogs.
4. **`pnpm release`**: On a clean, up-to-date `main`, runs `dropdx`. It applies the committed changesets, builds, commits `chore(release): bump to vX.Y.Z`, tags, pushes, and publishes the packages to npm.

Simulate a release without side effects with `pnpm exec dropdx --dry-run`.

---

## Automated Maintenance

The repository uses scheduled automation to keep core tooling up to date:

- **Dependabot** ([`.github/dependabot.yml`](../.github/dependabot.yml)) opens weekly pull requests for grouped npm dependencies (`spellbookx`, `vitest`, `changesets`, and core tools) and GitHub Actions.
- **Node.js LTS updates** ([`.github/workflows/update-node.yml`](../.github/workflows/update-node.yml)) run `pnpm update:node` every Monday to sync `.nvmrc` and `@types/node` across the workspace with the latest active Node.js LTS release.
- **Turborepo updates** ([`.github/workflows/update-turbo.yml`](../.github/workflows/update-turbo.yml)) run `pnpm update:turbo` every Monday to upgrade `turbo` and apply `@turbo/codemod` migrations.
