# spellbookx

A magical CLI for crafting developer toolchains, automation, environments, and wizards.

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
spellbookx init commitlint
# or using the alias
sbx init commitlint
```

---

## Features

- 🔮 **Magical CLI** - Beautiful, interactive command-line interface
- ✨ **Automated Setup** - Quick initialization of development tools
- 📦 **Package Manager Detection** - Automatically detects npm, pnpm, yarn, or bun
- 🎭 **Developer Friendly** - Clear, colorful output with helpful messages

---

## License

This project is licensed under the MIT License.

**Copyright (c) 2025 Davide Di Criscito**

For the full details, see the [LICENSE](LICENSE) file.
