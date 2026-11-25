# spellbookx

🧙 **The Spellbookx CLI** (`sbx`) — Automated setup and configuration wizard for the Spellbookx developer toolchain (ESLint, Prettier, CSpell, Commitlint, czg, and Lefthook).

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

In an interactive terminal the wizard asks, for each selected tool:

| Tool       | Questions                                                                                                   |
| :--------- | :---------------------------------------------------------------------------------------------------------- |
| ESLint     | Preset; format: `eslint.config.mjs` or `eslint.config.ts`                                                   |
| Prettier   | Preset; format: `prettier.config.mjs` or `prettier.config.ts`                                               |
| CSpell     | Format: YAML, JSON, or JavaScript with `defineSbxConfig`; for YAML and JSON, put it in `.config/`?          |
| Commitlint | Put it in `.config/`? (`.config/commitlint.mjs` or `commitlint.config.mjs`)                                 |
| czg        | Put it in `.config/`? (`.config/cz.mjs` or `cz.config.mjs`)                                                 |
| Lefthook   | Format: `.config/lefthook.yml`, `.config/lefthook.json`, or `.config/lefthook.toml`                         |
| VS Code    | Are you using VS Code? (generates `.vscode/settings.json` and `.vscode/extensions.json` for selected tools) |

When the process is not attached to a TTY (CI, pipes), it runs
non-interactively with the defaults, which give this layout:

```text
.
├── .config/
│   ├── commitlint.mjs
│   ├── cspell.yml
│   ├── cspell/
│   │   └── custom.txt
│   ├── cz.mjs
│   └── lefthook.yml
├── .editorconfig
├── .prettierignore
├── eslint.config.mjs
└── prettier.config.mjs
```

### Config file names

The wizard writes only the file names from each tool's documentation, and the
name decides the location:

- A `<tool>.config.<ext>` name (`eslint.config.mjs`, `prettier.config.mjs`,
  `cspell.config.yml`, `commitlint.config.mjs`, `cz.config.mjs`) always goes in
  the **project root**.
- A name that is only the tool name (`cspell.yml`, `cspell.json`,
  `commitlint.mjs`, `cz.mjs`, `lefthook.yml`) goes in **`.config/`**.

CSpell and Lefthook find their files in `.config/` by themselves. commitlint
and czg do not, so the generated scripts and hooks pass the path:

| File                     | Generated command                                                                                 |
| :----------------------- | :------------------------------------------------------------------------------------------------ |
| `.config/commitlint.mjs` | `commitlint --config ./.config/commitlint.mjs` (`lint:commits` and the Lefthook `commit-msg` job) |
| `.config/cz.mjs`         | `czg --config=./.config/cz.mjs` (`commit`). czg needs the `=`: it ignores `--config <path>`.      |

A JavaScript CSpell config is always `cspell.config.mjs` in the root, because
CSpell does not find a `.config/cspell.mjs`. The commitlint and czg configs are
always ES modules (`.mjs`).

### Options

```text
Usage: spellbookx init [options]

Initialize Spellbookx configurations

Options:
  -p, --pm <packageManager>   Package manager to use (pnpm, npm, yarn, bun)
  --skip-install              Generate configurations without installing packages
  -t, --tools <tools...>      Tools to configure (cspell, commitlint, czg, eslint, prettier, lefthook)
  --cspell                    Configure CSpell
  --commitlint                Configure Commitlint
  --czg                       Configure czg
  --eslint                    Configure ESLint
  --prettier                  Configure Prettier
  --lefthook                  Configure Lefthook
  --eslint-config <config>    ESLint preset (e.g. recommended-spellcheck, strict, all)
  --eslint-format <format>    ESLint config format (mjs, ts)
  --prettier-config <config>  Prettier preset (base, recommended)
  --prettier-format <format>  Prettier config format (mjs, ts)
  --cspell-format <format>    CSpell config format (yaml, json, mjs)
  --lefthook-format <format>  Lefthook config format (yaml, json, toml)
  --config-dir <tools...>     Put these configs in .config/ (cspell, commitlint, czg)
  --root <tools...>           Put these configs in the root (cspell, commitlint, czg)
  --vscode                    Generate .vscode/settings.json and .vscode/extensions.json
  -i, --interactive           Force interactive prompts
  -h, --help                  display help for command
```

The options are also available on the root command, so `sbx --eslint` behaves
like `sbx init --eslint`. An option that sets a choice skips its question.

### Examples

```bash
# Generate every configuration file without installing dependencies
sbx init --skip-install

# Configure a single tool
sbx init --cspell

# Select specific tools and package manager
sbx init --tools eslint prettier --pm pnpm

# TypeScript ESLint config, JSON CSpell config, TOML Lefthook config
sbx init --eslint-format ts --cspell-format json --lefthook-format toml

# Put the CSpell, commitlint, and czg configs in the root instead of .config/
sbx init --root cspell commitlint czg
```

---

## Managed Tools

| Tool             | Integrated Packages                                                                                                                | Generated Configurations                                                                 |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| **`cspell`**     | `cspell`, `cspell-config-spellbookx`                                                                                               | `.config/cspell.yml` (or another format), `.config/cspell/custom.txt`, `lint:spelling`   |
| **`commitlint`** | `@commitlint/cli`, `@commitlint/config-conventional`, `commitlint-config-spellbookx`, `conventional-changelog-conventionalcommits` | `.config/commitlint.mjs` (or `commitlint.config.mjs`), `lint:commits`                    |
| **`czg`**        | `czg`, `cz-config-spellbookx`                                                                                                      | `.config/cz.mjs` (or `cz.config.mjs`), `commit`                                          |
| **`eslint`**     | `eslint`, `eslint-plugin-spellbookx`, `@spellbookx/recipes` (and `jiti` for `eslint.config.ts`)                                    | `eslint.config.mjs` (or `.ts`), `lint:code`, `lint:code:fix`                             |
| **`prettier`**   | `prettier`, `prettier-config-spellbookx`                                                                                           | `prettier.config.mjs` (or `.ts`), `.prettierignore`, `.editorconfig`, `fmt`, `fmt:check` |
| **`lefthook`**   | `lefthook`                                                                                                                         | `.config/lefthook.yml` (or `.json`, `.toml`), `prepare`                                  |

### Commit prompt (czg)

Spellbookx writes commit messages with [czg](https://cz-git.qbb.sh/cli/) only,
not with Commitizen or `cz-git`. The generated config spreads the
`cz-config-spellbookx` preset into `definePrompt` from `czg`:

```javascript
import { config } from 'cz-config-spellbookx';
import { definePrompt } from 'czg';

export default definePrompt({
  ...config,
});
```

The wizard installs `czg` as a devDependency. Also install it globally, so it
works outside the project scripts:

```bash
npm install -g czg
```

### Git hooks (Lefthook)

[Lefthook](https://lefthook.dev/) is the only supported Git hook manager. The
generated config runs ESLint and then Prettier on the staged files before each
commit, and commitlint on the commit message. It contains only the jobs of the
selected tools. The `prepare` script (`lefthook install`) installs the hooks.

> The `.prettierignore` and `.editorconfig` files keep their usual names in the
> root: they are ignore and editor files, not tool configs.

---

## License

This project is licensed under the MIT License.

- **Author & Creator**: [Davide Di Criscito](https://github.com/dcdavidev)
- **Copyright**: © 2026 Davide Di Criscito and contributors.

For full details, see the [LICENSE](LICENSE) file.
