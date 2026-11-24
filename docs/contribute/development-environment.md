# Development Environment

This guide explains how to set up a local development environment for Spellbookx: install the required tools, get your own copy of the repository, and build the workspace. Follow these steps before you make your first change.

## Step 1: Install Node.js

Spellbookx requires **Node.js `26.x`**. The version is set in [`.nvmrc`](../../.nvmrc) and in the `engines` field of the root `package.json`.

You can download Node.js from the [official website](https://nodejs.org/) and follow the [installation guide](https://nodejs.org/en/download).

On macOS, Linux and Windows (WSL), we recommend [nvm](https://github.com/nvm-sh/nvm). It reads the version from `.nvmrc`, so you can run these commands from the repository root after you clone it (Step 2):

```bash
nvm install
```

```bash
nvm use
```

Update npm to the latest version:

```bash
npm install -g npm@latest
```

### Install pnpm

Spellbookx uses **pnpm `12.x`**. The exact version is pinned in the `packageManager` field of the root `package.json`.

Install pnpm as described in the [pnpm installation guide](https://pnpm.io/installation):

```bash
npx get-pnpm
```

Keep pnpm up to date with:

```bash
pnpm self-update
```

## Step 2: Fork and Checkout Your Own `spellbookx` Repository

1. Go to [github.com/dcdavidev/spellbookx](https://github.com/dcdavidev/spellbookx) and click **Fork** to create a copy of the repository in your GitHub account.

2. Clone your fork. Replace `<your-username>` with your GitHub username:

   ```bash
   git clone https://github.com/ < your-username > /spellbookx.git
   ```

   ```bash
   cd spellbookx
   ```

3. Install the dependencies:

   ```bash
   pnpm install
   ```

   This command also runs the `prepare` script, which installs the git hooks with [Lefthook](https://github.com/evilmartians/lefthook).

4. Build all packages:

   ```bash
   pnpm build
   ```

   You must build the packages before you lint, type-check or commit. The repository uses its own packages (for example `eslint-plugin-spellbookx` and `prettier-config-spellbookx`) in its root config files, and these config files load the packages from their `dist/` folders.

## Step 3: Add the Upstream Source

The _upstream source_ is the main Spellbookx repository that receives the contributions. Add it as a remote so that you can get the latest changes:

```bash
git remote add upstream https://github.com/dcdavidev/spellbookx.git
```

Before you start new work, update your local `main` branch:

```bash
git checkout main
```

```bash
git pull upstream main
```

Then create a topic branch from `main` for your change.

## Step 4: Run the Checks

Make sure that everything works before you change anything:

```bash
pnpm build && pnpm lint && pnpm fmt:check && pnpm test
```

CI runs the same checks on every pull request. For more information about the tests, see [Tests](./tests.md).

## Step 5: Configure Your Editor

The repository includes settings for [Visual Studio Code](https://code.visualstudio.com/) in the `.vscode/` folder:

- **Recommended extensions** (`.vscode/extensions.json`): ESLint, Prettier, EditorConfig, Code Spell Checker, Commitlint, YAML, GitHub Actions and Turborepo. VS Code asks you to install them when you open the folder.
- **Workspace settings** (`.vscode/settings.json`): format on save with Prettier, ESLint fixes when you save manually, and the workspace version of TypeScript (`node_modules/typescript/lib`).

When VS Code asks which TypeScript version to use, select **Use Workspace Version**. If the editor shows errors about missing files in `node_modules` after a `pnpm install`, run **TypeScript: Restart TS Server** from the command palette.

If you use another editor, install its EditorConfig, ESLint and Prettier integrations. The shared editor settings are in [`.editorconfig`](../../.editorconfig).

## Reference Information

### Directory Structure

- `packages/`: the published packages. Each package has `src/` (source code), `tests/` (tests), `dist/` (build output, not committed), `rolldown.config.ts`, `tsconfig.json` and `tsconfig.build.json`.
- `.config/`: configuration of the repository tools (commitlint, czg, CSpell, dropdx and Lefthook).
- `.changeset/`: pending changesets for the next release.
- `.github/`: CI workflow, issue templates and pull request template.
- `.agents/skills/`: skills for AI coding assistants.
- `docs/`: the contributing guide, the contributor guides and the security policy.

For more information about the packages and how they depend on each other, see [Architecture](./architecture.md).

### Workflow

Run any script from the repository root. To run a script for one package only, use `--filter`:

```bash
pnpm --filter eslint-plugin-spellbookx test
```

For the full list of scripts, see [Package.json Scripts Naming Conventions](./package-json-scripts-naming-conventions.md).
