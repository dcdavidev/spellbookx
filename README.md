![spellbookx](./images/gh-banner.png)

# Spellbookx

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen.svg)](.nvmrc)
[![pnpm Version](https://img.shields.io/badge/pnpm-%3E%3D10.0.0-orange.svg)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/turbo-2.x-blueviolet.svg)](https://turbo.build/repo)
[![Vitest](https://img.shields.io/badge/vitest-5.x-yellow.svg)](https://vitest.dev/)

A modern, highly modular monorepo of shareable developer tool configurations and recipes for JavaScript, TypeScript, React, Astro, Svelte, and Node.js.

Spellbookx streamlines your developer workflow by providing battle-tested, opinionated, and composable setups for linting, formatting, spell-checking, and commit conventions.

---

## Workspace Packages

| Package                                                                       | Description                                                                                                                                       |                                                               Version                                                               |
| :---------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------: |
| [**`eslint-plugin-spellbookx`**](./packages/eslint-plugin-spellbookx)         | Modern ESLint 10 Flat Config plugin bundling 16 modular presets, framework rules (React, Astro, Svelte, Node), and automated import sorting.      |     [![npm](https://img.shields.io/npm/v/eslint-plugin-spellbookx.svg)](https://www.npmjs.com/package/eslint-plugin-spellbookx)     |
| [**`prettier-config-spellbookx`**](./packages/prettier-config-spellbookx)     | Prettier configuration with 19 ready-to-use presets, plugins for Tailwind, Prisma, Astro, Svelte, SQL, Nginx, and the `defineSbxConfig` composer. |   [![npm](https://img.shields.io/npm/v/prettier-config-spellbookx.svg)](https://www.npmjs.com/package/prettier-config-spellbookx)   |
| [**`@spellbookx/recipes`**](./packages/recipes)                               | Curated import categorization rules and comprehensive ignore patterns for toolchains, operating systems, and runtimes.                            |          [![npm](https://img.shields.io/npm/v/@spellbookx/recipes.svg)](https://www.npmjs.com/package/@spellbookx/recipes)          |
| [**`commitlint-config-spellbookx`**](./packages/commitlint-config-spellbookx) | Strict Conventional Commits configuration with automatic workspace package scope discovery.                                                       | [![npm](https://img.shields.io/npm/v/commitlint-config-spellbookx.svg)](https://www.npmjs.com/package/commitlint-config-spellbookx) |
| [**`cz-config-spellbookx`**](./packages/cz-config-spellbookx)                 | Interactive `czg` commit prompt with the Spellbookx commit types, monorepo scopes, and purple theme.                                              |         [![npm](https://img.shields.io/npm/v/cz-config-spellbookx.svg)](https://www.npmjs.com/package/cz-config-spellbookx)         |
| [**`cspell-config-spellbookx`**](./packages/cspell-config-spellbookx)         | Multi-language CSpell spell-checker preset with extensive programming dictionaries, ignore globs, and technical jargon.                           |     [![npm](https://img.shields.io/npm/v/cspell-config-spellbookx.svg)](https://www.npmjs.com/package/cspell-config-spellbookx)     |
| [**`spellbookx`**](./packages/spellbookx)                                     | 🧙 The Spellbookx CLI (`sbx`) — Automated interactive setup wizard for ESLint, Prettier, CSpell, Commitlint, czg, and Lefthook.                   |                   [![npm](https://img.shields.io/npm/v/spellbookx.svg)](https://www.npmjs.com/package/spellbookx)                   |

---

## Key Highlights

- ⚡ **ESLint 10 Flat Configs**: Native support for ESLint flat configurations without legacy `.eslintrc` overhead.
- 🎨 **Multi-Framework Prettier**: First-class formatting presets for Tailwind CSS class sorting, Astro, Svelte, Prisma, SQL, and Nginx.
- 📦 **Monorepo-Aware Commitlint**: Automatically discovers all workspace packages across `pnpm-workspace.yaml`, `package.json`, and `lerna.json` for scope validation.
- 📖 **Technical & Multi-Lang Spellcheck**: Pre-configured CSpell dictionaries for English, Italian, Spanish, French, German, and programming runtimes.
- 🗂️ **Shared Recipes**: Centralized ignore patterns and regex groups for simple-import-sort and prettier-plugin-sort-imports.
- 🤖 **AI Agent Skills**: Built-in `.agents/skills` allowing AI coding assistants (Antigravity, Cursor, Copilot, Cline) to automatically scaffold and configure the toolchain.
- 🔄 **Strict Dogfooding**: This monorepo uses its own configurations across all root configurations and packages.
- 🚀 **Modern Toolchain**: Built with Turborepo, Rolldown, TypeScript, Vitest, and Lefthook.

---

## Quick Packages Overview

### 1. ESLint Plugin (`eslint-plugin-spellbookx`)

```bash
pnpm add -D eslint-plugin-spellbookx eslint
```

```javascript
// eslint.config.mjs
import { defineConfig } from 'eslint/config';
import spellbookx from 'eslint-plugin-spellbookx';

export default defineConfig([
  spellbookx.configs['recommended-spellcheck'],
  // or spellbookx.configs.recommended, spellbookx.configs.react, etc.
]);
```

### 2. Prettier Config (`prettier-config-spellbookx`)

```bash
pnpm add -D prettier-config-spellbookx prettier
```

```javascript
// prettier.config.mjs
export { default } from 'prettier-config-spellbookx';
// or use specific presets:
// export { default } from 'prettier-config-spellbookx/astro-tailwind';
// export { default } from 'prettier-config-spellbookx/base';
```

### 3. Spellbookx Recipes (`@spellbookx/recipes`)

```bash
pnpm add -D @spellbookx/recipes
```

```typescript
import recipes, { ignores, imports } from '@spellbookx/recipes';

console.log(imports.uiFrameworks); // Regex matching React, Vue, Svelte, Astro, etc.
console.log(ignores.node); // Array of globs for build outputs and caches
```

### 4. Commitlint Config (`commitlint-config-spellbookx`)

```bash
pnpm add -D commitlint-config-spellbookx @commitlint/cli
```

```javascript
// .config/commitlint.mjs
export { default } from 'commitlint-config-spellbookx';
```

```json
{
  "scripts": {
    "lint:commits": "commitlint --config ./.config/commitlint.mjs --from=HEAD~1 --verbose"
  }
}
```

### 5. czg Prompt (`cz-config-spellbookx`)

```bash
npm install -g czg
pnpm add -D cz-config-spellbookx czg
```

```javascript
// .config/cz.mjs
import { config } from 'cz-config-spellbookx';
import { definePrompt } from 'czg';

export default definePrompt({
  ...config,
  useEmoji: true,
});
```

```json
{
  "scripts": {
    "commit": "czg --config=./.config/cz.mjs"
  }
}
```

czg needs `--config=<path>` with `=`.

### 6. CSpell Config (`cspell-config-spellbookx`)

```bash
pnpm add -D cspell-config-spellbookx cspell
```

```yaml
# .config/cspell.yml (CSpell finds it without --config)
version: '0.2'
import:
  - cspell-config-spellbookx
dictionaryDefinitions:
  - name: project-words
    path: ./cspell/custom.txt
    addWords: true
dictionaries:
  - project-words
```

Or, with JavaScript, `cspell.config.mjs` in the root:

```javascript
// cspell.config.mjs
import { defineSbxConfig } from 'cspell-config-spellbookx';

export default defineSbxConfig({
  words: ['myCustomBrand'],
});
```

---

## AI Agent Skills

Spellbookx includes official agent skills conforming to the open [Agent Skills specification](https://github.com/vercel-labs/skills). These skills enable AI coding assistants (such as Antigravity, Cursor, Copilot, Cline, Zed, and Warp) to automatically configure, customize, and maintain the Spellbookx developer toolchain without manual setup or prompt engineering.

### Available Skills

| Skill                              | Description                                                                                        | Location                                                                                                |
| :--------------------------------- | :------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| **`spellbookx-setup`**             | Complete guided setup of the full Spellbookx suite into any JS/TS codebase or monorepo.            | [`.agents/skills/spellbookx-setup`](./.agents/skills/spellbookx-setup/SKILL.md)                         |
| **`spellbookx-eslint-plugin`**     | Configures ESLint 9+ flat configs with framework presets and `@spellbookx/recipes` import sorting. | [`.agents/skills/spellbookx-eslint-plugin`](./.agents/skills/spellbookx-eslint-plugin/SKILL.md)         |
| **`spellbookx-prettier-config`**   | Composes Prettier presets (Tailwind, Astro, Svelte, Prisma) using the `defineSbxConfig` composer.  | [`.agents/skills/spellbookx-prettier-config`](./.agents/skills/spellbookx-prettier-config/SKILL.md)     |
| **`spellbookx-cspell-config`**     | Configures multi-language code spell-checking, custom dictionaries, and ignore paths.              | [`.agents/skills/spellbookx-cspell-config`](./.agents/skills/spellbookx-cspell-config/SKILL.md)         |
| **`spellbookx-commitlint-config`** | Sets up Conventional Commits, monorepo scope discovery, and the commit-msg hook.                   | [`.agents/skills/spellbookx-commitlint-config`](./.agents/skills/spellbookx-commitlint-config/SKILL.md) |
| **`spellbookx-cz-config`**         | Sets up the interactive `czg` commit prompt.                                                       | [`.agents/skills/spellbookx-cz-config`](./.agents/skills/spellbookx-cz-config/SKILL.md)                 |

### Installation

Install all or selected Spellbookx skills into your project using the `skills` CLI:

```bash
# Add all Spellbookx skills to your project
npx skills add dcdavidev/spellbookx

# Or add a specific skill:
npx skills add dcdavidev/spellbookx --skill spellbookx-setup
npx skills add dcdavidev/spellbookx --skill spellbookx-eslint-plugin
npx skills add dcdavidev/spellbookx --skill spellbookx-prettier-config
npx skills add dcdavidev/spellbookx --skill spellbookx-cspell-config
npx skills add dcdavidev/spellbookx --skill spellbookx-commitlint-config
npx skills add dcdavidev/spellbookx --skill spellbookx-cz-config

# Or install globally for your personal AI assistant:
npx skills add -g dcdavidev/spellbookx
```

#### Manual Installation

You can also copy the skills directly into any project's `.agents/skills` folder:

```bash
mkdir -p .agents/skills
git clone --depth 1 https://github.com/dcdavidev/spellbookx.git /tmp/spellbookx
cp -r /tmp/spellbookx/.agents/skills/* .agents/skills/
rm -rf /tmp/spellbookx
```

### Usage with AI Assistants

Once installed, your AI assistant (Google Antigravity, Cursor, Claude Code, GitHub Copilot, Cline, Windsurf, Zed, or Warp) automatically discovers and activates the skills. You can interact with your agent using natural prompts:

- _"Set up Spellbookx in this project using the `spellbookx-setup` skill."_
- _"Configure ESLint flat config for my Next.js and Tailwind project using `spellbookx-eslint-plugin`."_
- _"Add a custom technical dictionary and ignore paths using `spellbookx-cspell-config`."_
- _"Check my commit message using `spellbookx-commitlint-config`."_
- _"Turn on emoji in the commit prompt using `spellbookx-cz-config`."_

For full documentation and skill guides, see [`.agents/README.md`](./.agents/README.md).

---

## Repository Structure

```text
spellbookx/
├── .agents/
│   └── skills/                        # AI agent skills (setup, eslint, prettier, etc.)
├── .changeset/                        # Pending changesets for the next release
├── .config/                           # Tool configs named after the tool
│   ├── commitlint.mjs                 # Commitlint config (--config ./.config/commitlint.mjs)
│   ├── cspell.yml                     # CSpell config
│   ├── cspell/
│   │   └── custom.txt                 # Project word list
│   ├── cz.mjs                         # czg prompt (--config=./.config/cz.mjs)
│   └── lefthook.yml                   # Git hooks (pre-commit, commit-msg)
├── .github/
│   ├── ISSUE_TEMPLATE/                # Bug report and feature request forms
│   ├── workflows/                     # CI: code quality and tests
│   └── PULL_REQUEST_TEMPLATE.md
├── .vscode/                           # Recommended extensions and settings
├── docs/
│   ├── contribute/                    # Contributor guides (architecture, conventions, tests)
│   ├── CONTRIBUTING.md
│   └── SECURITY.md
├── images/                            # README banner and assets
├── packages/
│   ├── commitlint-config-spellbookx/  # Conventional Commits rules + scopes
│   ├── cspell-config-spellbookx/      # CSpell multi-lang & technical dicts
│   ├── cz-config-spellbookx/          # czg interactive commit prompt
│   ├── eslint-plugin-spellbookx/      # ESLint flat configs (16 presets)
│   ├── prettier-config-spellbookx/    # Prettier configs (19 presets + composer)
│   ├── recipes/                       # @spellbookx/recipes: import groups, ignore globs, git scopes
│   └── spellbookx/                    # 🧙 The Spellbookx CLI (`sbx`)
├── .editorconfig                      # Consistent indentation and coding styles
├── .gitattributes                     # LF line endings and binary files
├── .nvmrc                             # Node.js LTS version (>= v24.x)
├── .prettierignore                    # Global format exclusions
├── eslint.config.mjs                  # Monorepo ESLint flat configuration
├── package.json                       # Monorepo workspace root scripts & devDeps
├── pnpm-workspace.yaml                # pnpm workspace definition
├── prettier.config.mjs                # Monorepo Prettier configuration
├── rolldown.base.ts                   # Shared Rolldown build config for all packages
├── skills-lock.json                   # Third-party agent skills (dropdx, vuoto)
└── turbo.json                         # Turborepo task pipeline configuration
```

Configs whose name contains `.config.` (`eslint.config.mjs`, `prettier.config.mjs`) live in the root. Configs named only after the tool live in `.config/`, and every script and hook passes their path.

---

## Development

### Prerequisites

- **Node.js**: `>= 24.0.0` (Active LTS recommended, see [`.nvmrc`](.nvmrc))
- **Package Manager**: [pnpm](https://pnpm.io/) `>= 10.0.0`

### Setup

```bash
# Clone the repository
git clone https://github.com/dcdavidev/spellbookx.git
cd spellbookx

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Available Scripts

Script names follow the `action[:target][:modifier]` convention described in [Package.json Scripts Naming Conventions](docs/contribute/package-json-scripts-naming-conventions.md).

| Script                   | Purpose                                                                   |
| :----------------------- | :------------------------------------------------------------------------ |
| `pnpm build`             | Compiles all workspace packages with Rolldown and `tsc`                   |
| `pnpm test`              | Runs all unit test suites with Vitest                                     |
| `pnpm test:watch`        | Runs Vitest in watch mode                                                 |
| `pnpm lint`              | Runs `lint:code`, `lint:spelling` and `lint:types` (checks only)          |
| `pnpm lint:code`         | Lints JavaScript, TypeScript, JSON and Markdown with ESLint               |
| `pnpm lint:code:fix`     | Lints and applies automatic fixes                                         |
| `pnpm lint:spelling`     | Spell-checks the repository with CSpell                                   |
| `pnpm lint:types`        | Type-checks sources and tests of every package                            |
| `pnpm lint:commits`      | Validates the last commit message against Conventional Commits            |
| `pnpm fmt`               | Formats all supported files                                               |
| `pnpm fmt:check`         | Verifies formatting without writing changes                               |
| `pnpm clean`             | Removes `.turbo` caches and package `dist/` folders                       |
| `pnpm commit`            | Launches the interactive `czg` commit prompt (`cz` and `czg` are aliases) |
| `pnpm changeset`         | Creates a new changeset interactively                                     |
| `pnpm changeset:commits` | Creates changesets from the Conventional Commits of the current branch    |
| `pnpm changeset:version` | Consumes changesets, bumps versions and updates changelogs                |
| `pnpm release`           | Versions, builds, commits, tags and publishes all packages with `dropdx`  |
| `pnpm update:turbo`      | Updates Turborepo and applies its codemods                                |

Pass extra flags after the script name, for example `pnpm build --force` to bypass the Turborepo cache.

---

## Git Workflow & Hooks

This project enforces commit hygiene and pre-commit checks using [Lefthook](https://github.com/evilmartians/lefthook):

1. **Pre-commit**: Runs ESLint (with fixes) and Prettier on staged files.
2. **Commit-msg**: Validates the commit message with `commitlint` according to Conventional Commits.
3. **Interactive Commits**: Run `pnpm run commit` to use the interactive `czg` prompt.

---

## Contributing

Contributions, issues, and feature requests are welcome! Please read our [Contributing Guide](./docs/CONTRIBUTING.md) for details on code style, commit conventions, and development workflows.

---

## License

This project is open-source software licensed under the [MIT License](./LICENSE).

- **Author & Creator**: [Davide Di Criscito](https://github.com/dcdavidev)
- **Copyright**: © 2026 Davide Di Criscito and contributors.

For full license details and permissions, see the [LICENSE](./LICENSE) file.
