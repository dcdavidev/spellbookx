# spellbookx

🧙 **The Spellbookx CLI** (`sbx`) — Automated setup and configuration wizard for the Spellbookx developer toolchain (ESLint, Prettier, CSpell, Commitlint, and recipes).

---

## Installation

Run instantly without global installation using your preferred runner:

```bash
# Using npx
npx spellbookx

# Using pnpm dlx
pnpm dlx spellbookx
# or with alias
pnpm dlx sbx

# Using bunx
bunx spellbookx
```

Or install globally:

```bash
npm install -g spellbookx
```

---

## Usage

Run `sbx` (or `sbx init`) to configure the toolchain. When no tool option is
passed, every tool is configured, so a plain run initializes all configuration
files:

```bash
sbx
# or explicitly
sbx init
```

In an interactive terminal you are prompted to pick the tools and presets. When
the process is not attached to a TTY (CI, pipes), it runs non-interactively
using the defaults.

### Options

```text
Usage: spellbookx init [options]

Initialize Spellbookx configurations

Options:
  -p, --pm <packageManager>   Package manager to use (pnpm, npm, yarn, bun)
  --skip-install              Generate configurations without installing packages
  -t, --tools <tools...>      Tools to configure (cspell, commitlint, eslint, prettier)
  --cspell                    Configure CSpell only
  --eslint                    Configure ESLint only
  --prettier                  Configure Prettier only
  --commitlint                Configure Commitlint & Commitizen only
  --prettier-config <config>  Prettier preset to use (base, recommended)
  --eslint-config <config>    ESLint preset to use (e.g. recommended-spellcheck, strict, all)
  --hook-manager <manager>    Git hook manager for commitlint (lefthook, husky)
  -i, --interactive           Force interactive prompts
  -h, --help                  display help for command
```

The options are also available on the root command, so `sbx --eslint` behaves
like `sbx init --eslint`.

### Examples

```bash
# Generate every configuration file without installing dependencies
sbx init --skip-install

# Configure a single tool
sbx init --cspell

# Select specific tools and package manager
sbx init --tools eslint prettier --pm pnpm

# Pick a Prettier preset, an ESLint preset, and the Git hook manager
sbx init --prettier-config recommended --eslint-config strict --hook-manager husky
```

---

## Managed Tools

| Tool             | Integrated Packages                                                                                                                                                                                          | Generated Configurations                                                                                   |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| **`cspell`**     | `@cspell/cspell-types`, `cspell`, `cspell-config-spellbookx`                                                                                                                                                 | `cspell.config.cjs`, `.config/cspell/custom-dictionary.txt`, `package.json` scripts                        |
| **`commitlint`** | `@commitlint/cli`, `@commitlint/config-conventional`, `@commitlint/lint`, `@commitlint/load`, `commitizen`, `commitlint-config-spellbookx`, `conventional-changelog-conventionalcommits`, `lefthook`/`husky` | `.czrc`, `commitlint.config.mjs`, `lefthook.yml` (or `.husky/commit-msg`), `package.json` config & scripts |
| **`eslint`**     | `eslint`, `eslint-plugin-spellbookx`, `@spellbookx/recipes`                                                                                                                                                  | `eslint.config.mjs`, `package.json` scripts                                                                |
| **`prettier`**   | `prettier`, `prettier-config-spellbookx`                                                                                                                                                                     | `prettier.config.mjs`, `.prettierignore`, `.editorconfig`, `package.json` scripts                          |

### Git hook manager

Commitlint hooks are installed through **Lefthook** or **Husky**. Pass
`--hook-manager husky` (or pick it in the wizard) to use Husky instead of the
default Lefthook. The selected manager is added as a dependency and wired to the
chosen package manager.

---

## License

This project is licensed under the MIT License.

- **Author & Creator**: [Davide Di Criscito](https://github.com/dcdavidev)
- **Copyright**: © 2026 Davide Di Criscito and contributors.

For full details, see the [LICENSE](LICENSE) file.
