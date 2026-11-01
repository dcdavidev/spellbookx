# cz-config-spellbookx

A modern, highly modular, and opinionated [`cz-git`](https://cz-git.qbb.sh/) and [Commitizen](https://github.com/commitizen/cz-cli) configuration for the Spellbookx ecosystem. Built with `definePrompt` from `cz-git`, it enforces the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification, automatically discovers monorepo package scopes, and provides an interactive purple-themed CLI prompt with emojis.

---

## Features

| Feature                     | Description                                                                                                            |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **Native `cz-git` Prompt**  | Built with `definePrompt` from `cz-git` (`maxHeaderLength: 72`, `breaklineNumber: 100`, multi-scope selection).        |
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

Install the package alongside `czg` or `cz-git`:

```bash
npm install --save-dev cz-config-spellbookx czg
```

Or with Commitizen:

```bash
npm install --save-dev cz-config-spellbookx cz-git commitizen
```

---

## Usage

According to the [cz-git Configuration Documentation](https://cz-git.qbb.sh/config/), `cz-git` and `czg` load configuration from `cz.config.(js|cjs|mjs|ts)`, `.czrc`, or `package.json`.

### 1. Default Export in `cz.config.mjs` (Recommended)

The simplest way to use this preset:

```javascript
// cz.config.mjs
export { default } from 'cz-config-spellbookx';
```

### 2. Customizing Prompt Options

Extend and customize specific `cz-git` prompt options using `definePrompt`:

```javascript
// cz.config.mjs
import { definePrompt } from 'cz-git';
import config from 'cz-config-spellbookx';

export default definePrompt({
  ...config,
  useEmoji: true,
  maxHeaderLength: 100,
});
```

### 3. Adding Custom Scopes

You can extend the dynamically discovered monorepo scopes from `@spellbookx/recipes/git` with custom scopes:

```javascript
// cz.config.mjs
import { definePrompt } from 'cz-git';
import { scopesArray } from '@spellbookx/recipes/git';
import { config } from 'cz-config-spellbookx';

export default definePrompt({
  ...config,
  scopes: [...scopesArray, 'custom-scope', 'analytics'],
});
```

### 4. Modular Building Blocks

Available building blocks exported from `cz-config-spellbookx`:

- `config` / `default` / `prompt`: Complete `cz-git` prompt configuration object created with `definePrompt`.
- `THEME_COLOR_CODE`: Constant `'38;5;135'` (Spellbookx purple ANSI 256-color code).

Shared git constants (`COMMIT_TYPES`, `SCOPE_WORKSPACE`, `SCOPE_RELEASE`, `scopesArray`, `scopesEnum`) and workspace discovery utilities (`findGitRoot`, `getScopes`, `getScopeDescription`, `getWorkspacesRawPath`) are provided by [`@spellbookx/recipes/git`](../recipes/README.md).

---

## Configuration File Formats

### In `cz.config.mjs` (ES Modules)

```javascript
export { default } from 'cz-config-spellbookx';
```

### In `cz.config.cjs` (CommonJS)

```javascript
const { config } = require('cz-config-spellbookx');

module.exports = config;
```

### In `cz.config.ts` (TypeScript)

```typescript
import { definePrompt } from 'cz-git';
import config from 'cz-config-spellbookx';

export default definePrompt({
  ...config,
});
```

---

## Running Interactive Commits

### Using `czg` CLI (Without Commitizen)

Add a commit script in your `package.json`:

```json
{
  "scripts": {
    "commit": "czg"
  }
}
```

Then run:

```bash
npm run commit
```

Or run directly with `npx`:

```bash
npx czg
```

### Using Commitizen (`cz`)

Configure Commitizen in your `package.json`:

```json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-git"
    }
  }
}
```

Then run:

```bash
npm run commit
```

---

## License

This project is licensed under the MIT License.

- **Author & Creator**: [Davide Di Criscito](https://github.com/dcdavidev)
- **Copyright**: © 2026 Davide Di Criscito and contributors.

For full details, see the [LICENSE](LICENSE) file.
