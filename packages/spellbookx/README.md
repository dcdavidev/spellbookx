# spellbookx

A magical CLI for crafting developer toolchains, automation, environments, and wizards.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Run All Setup Steps](#spellbookx-init-alias-sbx-init)
  - [Commitlint Setup](#spellbookx-init-commitlint-alias-sbx-init-commitlint)
  - [CSpell Setup](#spellbookx-init-cspell-alias-sbx-init-cspell)
  - [Prettier Setup](#spellbookx-init-prettier-alias-sbx-init-prettier)
  - [ESLint Setup](#spellbookx-init-eslint-alias-sbx-init-eslint)
  - [VSCode Setup](#spellbookx-init-vscode-alias-sbx-init-vscode)
- [License](#license)

---

## Features

- 🔮 **Magical CLI** - Beautiful, interactive command-line interface
- ✨ **Automated Setup** - Quick initialization of development tools
- 📦 **Package Manager Detection** - Automatically detects npm, pnpm, yarn, or bun
- 🎯 **Complete Toolchain** - Set up commitlint, cspell, prettier, eslint, and vscode in one command
- 🎨 **Customizable Presets** - Choose from multiple presets for Prettier and ESLint
- 💾 **Safe Backups** - Automatically backs up existing config files before overwriting
- 🎭 **Developer Friendly** - Clear, colorful output with helpful messages
- 🚀 **Zero Config** - Works out of the box with sensible defaults
- 🔧 **Individual Commands** - Run specific setup steps independently
- 📝 **EditorConfig Support** - Generates `.editorconfig` for consistent editor settings

---

## Installation

```bash
npm install -g spellbookx
# or
pnpm add -g spellbookx
# or
yarn global add spellbookx
# or
bun add -g spellbookx
```

---

## Usage

### Available Commands

#### `spellbookx init` (alias: `sbx init`)

Run all initialization steps in sequence to set up a complete development environment.

This command will execute all setup actions in the following order:

1. Commitlint
2. CSpell
3. Prettier
4. ESLint
5. VSCode

**Example:**

```bash
spellbookx init
# or using the alias
sbx init
```

---

#### `spellbookx init commitlint` (alias: `sbx init commitlint`)

Initialize commitlint configuration in your project.

This command will:

- Install required packages globally: `commitizen`, `cz-git`
- Install dev dependencies: `commitizen`, `cz-git`, `conventional-changelog-conventionalcommits`, `@commitlint/cli`, `@commitlint/config-conventional`, `commitlint-config-spellbookx`
- Create `commitlint.config.mjs` extending `commitlint-config-spellbookx`
- Create `.czrc` with `cz-git` configuration
- Update your `package.json` with commitizen config

**Example:**

```bash
sbx init commitlint
```

---

#### `spellbookx init cspell` (alias: `sbx init cspell`)

Initialize CSpell (Code Spell Checker) configuration in your project.

This command will:

- Install required packages globally: `cspell`
- Install dev dependencies: `cspell`, `@cspell/cspell-types`, `cspell-config-spellbookx`
- Create `.cspell` directory with `custom-words.txt` file
- Back up any existing CSpell config files to `.bak`
- Create `cspell.config.cjs` extending `cspell-config-spellbookx`

**Example:**

```bash
sbx init cspell
```

---

#### `spellbookx init prettier` (alias: `sbx init prettier`)

Initialize Prettier configuration in your project.

This command will:

- Install required packages globally: `prettier`
- Install dev dependencies: `prettier`, `prettier-config-spellbookx`, and related plugins
- Prompt you to choose a Prettier preset (base, astro, astro-prisma, astro-tailwind, astro-prisma-tailwind)
- Create `prettier.config.mjs` with your chosen preset
- Create `.editorconfig` with consistent editor settings
- Create `.prettierignore` with sensible defaults

**Example:**

```bash
sbx init prettier
```

---

#### `spellbookx init eslint` (alias: `sbx init eslint`)

Initialize ESLint configuration in your project using Flat Config.

This command will:

- Install required packages globally: `eslint`
- Install dev dependencies: `eslint`, `eslint-plugin-spellbookx`, and all peer dependencies
- Prompt you to choose an ESLint preset (recommended, recommended-react, recommended-astro, etc.)
- Back up any legacy ESLint config files to `.bak`
- Create `eslint.config.mjs` with your chosen preset

**Available presets:**

- `recommended` - Full setup with JS/TS, JSON, Markdown, Prettier, and CSpell
- `recommended-react` - Recommended + React/JSX support
- `recommended-astro` - Recommended + Astro support
- `recommended-no-spellcheck` - Recommended without CSpell
- Individual configs: `javascript`, `react`, `json`, `markdown`, `cspell`, `prettier`, `ignores`

**Example:**

```bash
sbx init eslint
```

---

#### `spellbookx init vscode` (alias: `sbx init vscode`)

Initialize VSCode workspace configuration in your project.

This command will:

- Create `.vscode` directory if it doesn't exist
- Back up existing `extensions.json` and `settings.json` to `.bak`
- Create `extensions.json` with recommended extensions (33 extensions for modern development)
- Create `settings.json` with comprehensive workspace settings including:
  - Per-language formatters and tab sizes
  - ESLint flat config support
  - Editor settings (format on save, rulers, etc.)
  - Extension-specific configurations
  - File associations and JSON/YAML schemas

**Example:**

```bash
sbx init vscode
```

---

## License

This project is licensed under the MIT License.

**Copyright (c) 2025 Davide Di Criscito**

For the full details, see the [LICENSE](LICENSE) file.
