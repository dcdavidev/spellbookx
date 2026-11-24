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

---

## Security Policy

For vulnerability reporting, please see our [Security Policy](./SECURITY.md).

---

## Contributor Guides

This page is the entry point. The guides in [`docs/contribute/`](./contribute/) cover each topic in depth:

| Guide                                                                                              | Intent                                                                                                                   |
| :------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| [Development Environment](./contribute/development-environment.md)                                 | Set up Node.js, pnpm and a local fork of the repository, then install and build the workspace.                           |
| [Architecture](./contribute/architecture.md)                                                       | Explains the design principles, the package topology and the build, test, release and CI pipelines.                      |
| [Code Conventions](./contribute/code-conventions.md)                                               | Defines the rules for source files, such as the mandatory `@fileoverview` header and the lint and formatting rules used. |
| [Commit Message Style](./contribute/commit-style.md)                                               | Explains how to write Conventional Commits with the `czg` prompt.                                                        |
| [Package.json Scripts Naming Conventions](./contribute/package-json-scripts-naming-conventions.md) | Defines the `action[:target][:modifier]` grammar for scripts and lists the root and package scripts.                     |
| [Tests](./contribute/tests.md)                                                                     | Explains how to build the packages and run the test suites.                                                              |

---

## Prerequisites

Before contributing, make sure your development environment meets the following requirements:

- **Node.js**: version `26.x` (see [`.nvmrc`](../.nvmrc) and the `engines` field of the root `package.json`).
- **pnpm**: version `12.x` (the exact version is pinned in the `packageManager` field of the root `package.json`). Install it as described in the [pnpm installation guide](https://pnpm.io/installation):

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

   > **Note**: Running `pnpm install` automatically configures git hooks using [Lefthook](https://github.com/evilmartians/lefthook).

4. **Build all packages:**

   ```bash
   pnpm run build
   ```

---

## Monorepo Architecture

Spellbookx is organized as a pnpm monorepo managed with [Turborepo](https://turbo.build/):

```text
spellbookx/
├── packages/
│   ├── commitlint-config-spellbookx/  # Conventional Commits rules + scopes
│   ├── cspell-config-spellbookx/      # CSpell multi-language & tech dictionaries
│   ├── cz-config-spellbookx/          # czg interactive commit prompt configuration
│   ├── eslint-plugin-spellbookx/      # ESLint flat configs (16 presets)
│   ├── prettier-config-spellbookx/    # Prettier configs (19 presets + composer)
│   ├── recipes/                       # Shared import sorting, ignore globs & git recipes
│   └── spellbookx/                    # 🧙 The Spellbookx CLI (`sbx`)
├── .agents/skills/                    # AI Agent skills for developer assistants
├── .config/                           # Tool configs (commitlint, cz, cspell, dropdx, lefthook)
├── docs/                              # Contributing guide, contributor guides & security policy
├── rolldown.base.ts                   # Shared Rolldown build configuration
├── pnpm-workspace.yaml                # Workspace package mappings
└── turbo.json                         # Turborepo task pipeline configuration
```

Each package has its own `tsconfig.json` (type-checking of `src/` and `__tests__/`) and `tsconfig.build.json` (emits the `.d.ts` declarations).

For the design principles and the dependency graph between packages, see [Architecture](./contribute/architecture.md).

---

## Development Workflow

### Useful Commands

Script names follow the `action[:target][:modifier]` convention described in [Package.json Scripts Naming Conventions](./contribute/package-json-scripts-naming-conventions.md).

| Command              | Description                                                             |
| :------------------- | :---------------------------------------------------------------------- |
| `pnpm build`         | Compiles all packages using Rolldown and TypeScript (`tsc`).            |
| `pnpm test`          | Runs unit tests across all packages using Vitest.                       |
| `pnpm test:watch`    | Runs Vitest in interactive watch mode.                                  |
| `pnpm lint`          | Runs every read-only check: `lint:code`, `lint:spelling`, `lint:types`. |
| `pnpm lint:code`     | Lints JavaScript, TypeScript, JSON, and Markdown with ESLint.           |
| `pnpm lint:code:fix` | Lints and applies automatic ESLint fixes.                               |
| `pnpm lint:commits`  | Checks the last commit message with Commitlint.                         |
| `pnpm lint:spelling` | Runs CSpell across the entire codebase.                                 |
| `pnpm lint:types`    | Type-checks the sources and tests of every package.                     |
| `pnpm fmt`           | Formats all code files using Prettier.                                  |
| `pnpm fmt:check`     | Verifies code formatting with Prettier without writing.                 |
| `pnpm clean`         | Cleans build caches (`.turbo/` and `dist/` folders).                    |

Add `--force` to bypass the Turborepo cache, for example `pnpm test --force`.

### Targeting Specific Packages

You can run commands for an individual package using pnpm's `--filter` option:

```bash
# Build only the CLI package
pnpm --filter spellbookx run build

# Run tests only for the ESLint plugin
pnpm --filter eslint-plugin-spellbookx test

# Add a dependency to a specific package
pnpm --filter @spellbookx/recipes add <package-name>
```

### Code Conventions

Every source file starts with a `@fileoverview` header. Lint and formatting rules come from the project's own `eslint-plugin-spellbookx` and `prettier-config-spellbookx`. See [Code Conventions](./contribute/code-conventions.md).

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
  - `workspace`: root files, such as config files and the root `package.json`
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

1. **Pre-commit**:
   - Lints (ESLint, including spellcheck) and formats (Prettier) all staged files automatically.
   - Type-checks every package when TypeScript files are staged.
   - Checks that `pnpm-lock.yaml` is up to date when a `package.json` or `pnpm-workspace.yaml` is staged.
2. **Commit-msg**: Validates the commit message format with Commitlint.

---

## Testing Guidelines

- Every new feature, utility function, or bugfix must be accompanied by unit tests.
- Place tests in a `__tests__/` directory located at the root of the respective package.
- Keep test files split, focused, and named after the module under test (e.g., `banner.test.ts`, `detect-pm.test.ts`).
- Ensure all tests pass with:

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
   pnpm build && pnpm lint && pnpm fmt:check && pnpm test
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
   - CI ([`.github/workflows/code-quality-and-tests.yml`](../.github/workflows/code-quality-and-tests.yml)) must pass.

---

## Release Process

Releases are driven by [Changesets](https://github.com/changesets/changesets) and published with [`dropdx`](https://github.com/dcdavidev/dropdx):

1. **`pnpm changeset`**: Creates a changeset describing your change.
2. **`pnpm changeset:commits`**: Creates changesets automatically from Conventional Commits.
3. **`pnpm changeset:version`**: Consumes the changesets, bumps package versions in lockstep, and updates the changelogs.
4. **`pnpm release`**: On a clean, up-to-date `main`, runs `dropdx`. It applies the committed changesets, builds, commits `chore(release): bump to vX.Y.Z`, tags, pushes and publishes the packages to npm.

Simulate a release without side effects with `pnpm exec dropdx --dry-run`.
