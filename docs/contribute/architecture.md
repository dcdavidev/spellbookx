# Spellbookx Architecture

## 1. Executive Summary & Philosophy

**Spellbookx** is a modular, high-performance monorepo providing composable, production-ready developer toolchain configurations for modern JavaScript, TypeScript, React, Astro, Svelte, and Node.js environments.

The project is guided by four foundational architectural principles:

1. **Native Modern Standards First**: Exclusively target modern web and tooling standards—ESLint 9+ Flat Configs, pure ECMAScript Modules (`"type": "module"`), TypeScript strict mode, and native Node.js / pnpm workflows without legacy wrappers or polyfills.
2. **Single Source of Truth (SSOT)**: Shareable primitives, such as import order groupings, ignore globs, and framework definitions, are centralized in `@spellbookx/recipes` and reused uniformly across ESLint, Prettier, and CSpell.
3. **Strict Dogfooding**: The monorepo uses its own configuration packages (`eslint-plugin-spellbookx`, `prettier-config-spellbookx`, `commitlint-config-spellbookx`, `cspell-config-spellbookx`) across all its source code, root configs, and sub-packages.
4. **Infinite Composability & Zero Friction**: Every preset can be used out-of-the-box with a one-line import, or composed and customized via helper functions like `defineSbxConfig`.

---

## 2. Monorepo Structure & Package Topology

The repository is organized as a pnpm workspace orchestrated by **Turborepo** for build caching and topological pipeline execution.

```text
spellbookx/
├── packages/
│   ├── eslint-plugin-spellbookx/     # ESLint 9+ Flat Config plugin with 16 modular presets
│   ├── prettier-config-spellbookx/   # Prettier presets, plugins & defineSbxConfig composer
│   ├── commitlint-config-spellbookx/ # Conventional Commits rules and monorepo scope discovery
│   ├── cspell-config-spellbookx/     # Multi-language & technical spellcheck configuration
│   ├── cz-config-spellbookx/         # czg interactive commit prompt configuration
│   ├── recipes/                      # Core shared recipes (import regexes & ignore patterns)
│   └── spellbookx/                   # CLI wizard (`sbx`) for interactive toolchain scaffolding
├── .agents/
│   └── skills/                       # Built-in AI Agent skills for assisted toolchain adoption
├── .changeset/                       # Changesets release orchestration & lockstep versioning
├── docs/                             # Contributing guide, contributor guides & security policy
│   ├── CONTRIBUTING.md               # Contributing guide (entry point)
│   ├── contribute/                   # Contributor guides, including this architecture document
│   └── SECURITY.md                   # Security policy
└── turbo.json                        # Monorepo pipeline definition
```

### Dependency & Relationship Graph

```mermaid
flowchart TD
    subgraph Core ["Core Foundations"]
        RECIPES["@spellbookx/recipes<br/><i>Shared Import Rules & Ignore Globs</i>"]
    end

    subgraph Tooling ["Config Packages"]
        ESLINT["eslint-plugin-spellbookx<br/><i>ESLint 9 Flat Configs</i>"]
        PRETTIER["prettier-config-spellbookx<br/><i>Prettier Presets & Plugins</i>"]
        COMMITLINT["commitlint-config-spellbookx<br/><i>Monorepo Scope Discovery</i>"]
        CSPELL["cspell-config-spellbookx<br/><i>Multi-Language Spellcheck</i>"]
    end

    subgraph Distribution ["User Entrypoints"]
        CLI["spellbookx (`sbx`)<br/><i>Interactive CLI Wizard</i>"]
        SKILLS[".agents/skills<br/><i>AI Assistant Integrations</i>"]
    end

    RECIPES -->|Imports regex & ignores| ESLINT
    RECIPES -->|Import order & ignores| PRETTIER
    RECIPES -.->|Shared ignore patterns| CSPELL

    ESLINT --> CLI
    PRETTIER --> CLI
    COMMITLINT --> CLI
    CSPELL --> CLI

    Tooling -.->|Automated guidance| SKILLS
    CLI -.->|Assisted workflows| SKILLS
```

---

## 3. Package Architecture & Deep Dives

### 3.1 `@spellbookx/recipes`

- **Role**: Foundational, zero-dependency library providing curated constants and regex patterns.
- **Components**:
  - `imports`: Categorized RegExp rules for module import ordering (e.g., node built-ins, framework runtimes, component libraries, state management, utilities, internal aliases, styles).
  - `ignores`: Exhaustive ignore globs grouped by domain (Node runtime artifacts, package managers, build outputs, frameworks like Astro/Next/Svelte, test runners, operating system artifacts).
- **Export Strategy**: Provides both granular exports (`@spellbookx/recipes/imports`, `@spellbookx/recipes/ignores`) and a root aggregator.

### 3.2 `eslint-plugin-spellbookx`

- **Role**: ESLint 9+ native Flat Config plugin exporting 16 modular presets.
- **Key Modules**:
  - `recommended`: Standard TypeScript & JavaScript best practices.
  - `recommended-spellcheck`: Recommended rules + integrated CSpell linting.
  - Framework configs: `react`, `astro`, `svelte`, `node`.
  - Format & syntax configs: `json`, `markdown`, `strict`, `all`, `vuoto` (clean baseline).
- **Import Sorting**: Integrates `eslint-plugin-simple-import-sort` driven by patterns from `@spellbookx/recipes/imports`.
- **Ignore Strategy**: Exports `configs.ignores` utilizing `@spellbookx/recipes/ignores`.

### 3.3 `prettier-config-spellbookx`

- **Role**: Prettier configuration bundle supporting multi-framework formatting.
- **Key Modules**:
  - Modular presets for Tailwind CSS class sorting, Astro, Svelte, Prisma, SQL, Nginx, XML, and multiline arrays.
  - `defineSbxConfig`: A configuration composer function that deduplicates plugins, validates mutual exclusion, and merges custom override options.
  - Import sorting via `@ianvs/prettier-plugin-sort-imports` or `prettier-plugin-organize-imports`, aligning with `@spellbookx/recipes`.

### 3.4 `commitlint-config-spellbookx`

- **Role**: Monorepo-aware Conventional Commits configuration.
- **Key Features**:
  - **Dynamic Scope Resolution**: Inspects workspace manifests (`pnpm-workspace.yaml`, `package.json` workspaces, and `lerna.json`) at runtime to dynamically allow workspace package names as valid commit scopes without hardcoding.
  - **Interactive Commit Prompt**: The matching `czg` prompt lives in `cz-config-spellbookx`, which shares the same commit types and scopes.

### 3.5 `cspell-config-spellbookx`

- **Role**: Shareable spell-checking configuration powered by CSpell.
- **Key Features**:
  - Bundled dictionaries for programming terms, tooling jargon, and multi-language support (English, Italian, Spanish, French, German).
  - Pre-configured ignore paths matching `@spellbookx/recipes/ignores`.

### 3.6 `spellbookx` (CLI: `sbx`)

- **Role**: Interactive terminal wizard for bootstrapping and managing the Spellbookx toolchain in user projects.
- **Stack**: Built with `commander`, `@inquirer/prompts`, `ora`, `chalk`, and `execa`.
- **Capabilities**: Detects project framework (React, Astro, Svelte, Node), package manager, and existing configs; interactively scaffolds `eslint.config.mjs`, `prettier.config.mjs`, `commitlint.config.mjs`, `cspell.json`, and installs required dependencies.

### 3.7 `.agents/skills`

- **Role**: AI coding assistant context and automation manifests.
- **Purpose**: Enables agents (Antigravity, Cursor, Copilot, Cline) to read structured skill manifests (`SKILL.md`) to safely configure, troubleshoot, and migrate projects to Spellbookx.

---

## 4. Build, Test, & Release Pipeline

### 4.1 Build Engine: Rolldown & TypeScript

- Every package builds with **Rolldown** (`rolldown -c`) from the shared [`rolldown.base.ts`](../../rolldown.base.ts). Each `rolldown.config.ts` only calls `definePackageBuild()`.
- Every file in `src/` is an entry and `preserveModules` is enabled, so `dist/` mirrors `src/` one-to-one (no hashed chunks).
- Bare imports (npm packages, workspace packages, `node:` built-ins) stay external: runtime dependencies are installed by consumers, not bundled.
- Type declarations (`.d.ts`) are emitted by `tsc -p tsconfig.build.json`. `tsconfig.json` covers `src/` and `__tests__/` with `noEmit` and powers `lint:types` and the editor.

### 4.2 Monorepo Task Orchestration: Turborepo

Turborepo coordinates dependencies and parallel execution across the workspace:

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["$TURBO_DEFAULT$"]
    },
    "lint:types": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$"],
      "outputs": []
    }
  }
}
```

- `dependsOn: ["^build"]` ensures that foundational dependencies (such as `@spellbookx/recipes`) are built before consuming packages (`eslint-plugin-spellbookx`, `prettier-config-spellbookx`).
- `lint:types` needs the declarations of the workspace dependencies, so it also depends on `^build`.

### 4.3 Versioning & Publishing: Changesets and dropdx

- Versioning is synchronized across packages using `@changesets/cli` with a `fixed` configuration group.
- Conventional Commits are mapped into changeset entries via `changeset-conventional-commits`.
- Packages are built, tagged, and published by [`dropdx`](https://github.com/dcdavidev/dropdx).
- Publishing workflow:
  1. On the feature branch, `pnpm changeset:commits` (or `pnpm changeset` interactively) creates the release intents. Commit them with the change.
  2. On a clean, up-to-date `main`, `pnpm release` runs `dropdx`. It runs `changeset version` on the committed changesets, builds, commits `chore(release): bump to vX.Y.Z`, tags, pushes and publishes to npm. `.config/dropdx.config.json` sets `conventionalCommits: true`, so the release commit passes commitlint on every OS.

### 4.4 Continuous Integration

[`.github/workflows/code-quality-and-tests.yml`](../../.github/workflows/code-quality-and-tests.yml) runs on every pull request and on pushes to `main`. It runs each check as a separate step: build, commit messages, `lint:code`, `lint:spelling`, `fmt:check`, `lint:types`, and `test`. Script names follow [Package.json Scripts Naming Conventions](package-json-scripts-naming-conventions.md).

---

## 5. Quality Assurance & Git Automation

- **Pre-commit Automation**: Managed by **Lefthook** (`.config/lefthook.yml`). Executes staged-file formatting, ESLint validation, and CSpell checks in parallel before commits are allowed.
- **Commit-msg Validation**: Lefthook triggers `@commitlint/cli` using `commitlint-config-spellbookx` to enforce Conventional Commits rules on every commit message.
- **Unit Testing**: Vitest runs unit and integration tests across all packages, verifying preset outputs, rule validity, and CLI flows.
