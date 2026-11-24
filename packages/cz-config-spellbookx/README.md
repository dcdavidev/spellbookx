# cz-config-spellbookx

A modern, highly modular, and opinionated [`czg`](https://cz-git.qbb.sh/cli/) configuration for the Spellbookx ecosystem. Spellbookx writes commit messages with the `czg` CLI only, not with Commitizen. Built with `definePrompt` from `czg`, it enforces the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification, automatically discovers monorepo package scopes, and provides an interactive purple-themed CLI prompt with emojis.

---

## Features

| Feature                     | Description                                                                                                            |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **Native `czg` Prompt**     | Built with `definePrompt` from `czg` (`maxHeaderLength: 72`, `breaklineNumber: 100`, multi-scope selection).           |
| **Purple Brand Theme**      | Styled out-of-the-box with the Spellbookx purple terminal theme (`themeColorCode: '38;5;135'`).                        |
| **Dynamic Monorepo Scopes** | Automatically discovers workspace packages from `pnpm-workspace.yaml`, `package.json`, and `lerna.json`.               |
| **Standard Special Scopes** | Built-in support for `workspace` (root/infra changes) and `release` (versioning commits).                              |
| **Modular Architecture**    | Import individual building blocks (`config`, `prompt`, `THEME_COLOR_CODE`) and combine with `@spellbookx/recipes/git`. |

---

## Supported Commit Types

| Type           | Emoji | Title                   | Description                                                                       |
| :------------- | :---: | :---------------------- | :-------------------------------------------------------------------------------- |
| **`feat`**     |  ✨   | Features                | A new feature for the user or codebase                                            |
| **`fix`**      |  🐛   | Bug Fixes               | A bug fix                                                                         |
| **`docs`**     |  📖   | Documentation           | Documentation only changes                                                        |
| **`style`**    |  🎨   | Styles                  | Changes that do not affect the meaning of the code (whitespace, formatting, etc.) |
| **`refactor`** |  🧹   | Code Refactoring        | A code change that neither fixes a bug nor adds a feature                         |
| **`perf`**     |  🚀   | Performance             | A code change that improves performance                                           |
| **`test`**     |  🧪   | Tests                   | Adding missing tests or correcting existing tests                                 |
| **`build`**    |  📦   | Builds                  | Changes that affect the build system or external dependencies                     |
| **`ci`**       |  🤖   | Continuous Integrations | Changes to CI configuration files and scripts                                     |
| **`chore`**    |  ♻️   | Chores                  | Other changes that don't modify src or test files                                 |
| **`revert`**   |  🔙   | Reverts                 | Reverts a previous commit                                                         |

---

## Installation

Install `czg` globally, so it works in any repository:

```bash
npm install -g czg
```

Then install the preset and `czg` in the project, so every contributor and script uses the same version:

```bash
npm install --save-dev cz-config-spellbookx czg
```

`czg` is a peer dependency of `cz-config-spellbookx`.

---

## Choosing the Config File

The file name decides where the config lives:

| File                                      | Location             | How `czg` finds it                                               |
| :---------------------------------------- | :------------------- | :--------------------------------------------------------------- |
| `cz.config.mjs` (or `.js`, `.cjs`, `.ts`) | Repository root      | Automatically ([czg config docs](https://cz-git.qbb.sh/config/)) |
| `.config/cz.mjs`                          | `.config/` directory | With `czg --config=./.config/cz.mjs`                             |

A name with `.config.` in it always goes in the root. A name that is only the tool name goes in `.config/`, and the CLI gets the path through `--config`.

> **Write `--config=<path>`, with `=`.** `czg` ignores `--config <path>` with a space and silently falls back to its defaults.

---

## Usage

### 1. Use the Preset As Is

```javascript
// .config/cz.mjs (or cz.config.mjs in the root)
export { default } from 'cz-config-spellbookx';
```

### 2. Customizing Prompt Options

Spread the preset into `definePrompt` from `czg`:

```javascript
// .config/cz.mjs
import { config } from 'cz-config-spellbookx';
import { definePrompt } from 'czg';

export default definePrompt({
  ...config,
  useEmoji: true,
});
```

Keep `types`, `scopes`, and `maxHeaderLength` from the preset if you use `commitlint-config-spellbookx`: commitlint rejects types, scopes, and headers that do not match them.

### 3. Adding Custom Scopes

Extend the discovered monorepo scopes from `@spellbookx/recipes/git` (add `@spellbookx/recipes` to your `devDependencies` to import it):

```javascript
// .config/cz.mjs
import { scopesArray } from '@spellbookx/recipes/git';
import { config } from 'cz-config-spellbookx';
import { definePrompt } from 'czg';

export default definePrompt({
  ...config,
  scopes: [...scopesArray, 'custom-scope', 'analytics'],
});
```

With `commitlint-config-spellbookx`, add the same scopes to the commitlint `scope-enum` rule.

### 4. Modular Building Blocks

Available building blocks exported from `cz-config-spellbookx`:

- `config` / `default` / `prompt`: Complete `czg` prompt configuration object created with `definePrompt`.
- `THEME_COLOR_CODE`: Constant `'38;5;135'` (Spellbookx purple ANSI 256-color code).

Shared git constants (`COMMIT_TYPES`, `SCOPE_WORKSPACE`, `SCOPE_RELEASE`, `scopesArray`, `scopesEnum`) and workspace discovery utilities (`findGitRoot`, `getScopes`, `getScopeDescription`, `getWorkspacesRawPath`) are provided by [`@spellbookx/recipes/git`](../recipes/README.md).

---

## Running Interactive Commits

Add the commit scripts to `package.json`:

```json
{
  "scripts": {
    "commit": "czg --config=./.config/cz.mjs",
    "cz": "npm run commit",
    "czg": "npm run commit"
  }
}
```

With a root `cz.config.mjs`, use `"commit": "czg"`.

Stage your changes, then run:

```bash
npm run commit
```

---

## License

This project is licensed under the MIT License.

- **Author & Creator**: [Davide Di Criscito](https://github.com/dcdavidev)
- **Copyright**: © 2026 Davide Di Criscito and contributors.

For full details, see the [LICENSE](LICENSE) file.
