# commitlint-config-spellbookx

A modern, highly modular, and opinionated [Commitlint](https://commitlint.js.org/) configuration for the Spellbookx ecosystem. It enforces the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification, automatically discovers monorepo package scopes, and provides an interactive [cz-git](https://cz-git.qbb.sh/) prompt with emojis.

---

## Features

| Feature                       | Description                                                                                                                               |
| :---------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **Conventional Commits**      | Extends `@commitlint/config-conventional` with strict, opinionated rules (72-char headers, 100-char bodies/footers, no trailing periods). |
| **Dynamic Monorepo Scopes**   | Automatically discovers workspace packages from `pnpm-workspace.yaml`, `package.json`, and `lerna.json`.                                  |
| **Standard Special Scopes**   | Built-in support for `workspace` (root/infra changes) and `release` (versioning commits).                                                 |
| **Interactive cz-git Prompt** | Out-of-the-box support for `commitizen` with rich emojis, descriptions, and multi-scope selection.                                        |
| **Modular Architecture**      | Import individual building blocks (`config`, `rules`, `prompt`) and combine with `@spellbookx/recipes/git`.                               |

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

Install the package and commitlint using **npm**:

```bash
npm install --save-dev commitlint-config-spellbookx @commitlint/cli
```

---

## Usage

Commitlint loads configuration from standard config files in your repository root. Because the package is named `commitlint-config-spellbookx`, Commitlint's [Shareable Configuration](https://commitlint.js.org/reference/configuration.html#shareable-configuration) resolution allows you to simply specify `'spellbookx'` in the `extends` array.

### 1. Shareable Configuration (Recommended)

Extend `'spellbookx'` in your Commitlint configuration:

```javascript
// commitlint.config.mjs
export default {
  extends: ['spellbookx'],
};
```

Alternatively, you can re-export the default configuration object directly:

```javascript
// commitlint.config.mjs
export { default } from 'commitlint-config-spellbookx';
```

### 2. Customizing Rules

Extend `'spellbookx'` and override specific Commitlint rules:

```javascript
// commitlint.config.mjs
export default {
  extends: ['spellbookx'],
  rules: {
    'header-max-length': [2, 'always', 100],
  },
};
```

### 3. Adding Custom Scopes

You can extend the dynamically discovered monorepo scopes from `@spellbookx/recipes/git` with custom scopes:

```javascript
// commitlint.config.mjs
import { scopesArray } from '@spellbookx/recipes/git';

export default {
  extends: ['spellbookx'],
  rules: {
    'scope-enum': [2, 'always', [...scopesArray, 'custom-scope', 'analytics']],
  },
};
```

### 4. Fully Modular Building Blocks

Assemble your configuration from modular pieces:

```javascript
// commitlint.config.mjs
import { rules, prompt } from 'commitlint-config-spellbookx';

export default {
  extends: ['@commitlint/config-conventional'],
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules,
  prompt,
};
```

Available building blocks:

- `config`: Complete, ready-to-use commitlint configuration object.
- `rules`: Strict Conventional Commit rules (`type-enum`, `scope-enum`, `header-max-length`, etc.).
- `prompt`: Commitizen / `cz-git` interactive questionnaire configuration with emojis and multi-scope support.

Shared git constants (`COMMIT_TYPES`, `SCOPE_WORKSPACE`, `SCOPE_RELEASE`, `scopesArray`, `scopesEnum`) and workspace discovery utilities (`findGitRoot`, `getScopes`, `getScopeDescription`, `getWorkspacesRawPath`) are provided by [`@spellbookx/recipes/git`](../recipes/README.md).

---

## Configuration File Formats

According to the [Commitlint Shareable Configuration Documentation](https://commitlint.js.org/reference/configuration.html#shareable-configuration), you can define your configuration in any of the following formats:

### In `commitlint.config.mjs` (ES Modules)

```javascript
export default {
  extends: ['spellbookx'],
};
```

### In `commitlint.config.cjs` (CommonJS)

```javascript
module.exports = {
  extends: ['spellbookx'],
};
```

### In `commitlint.config.ts` (TypeScript)

```typescript
import type { UserConfig } from '@commitlint/types';

const userConfig: UserConfig = {
  extends: ['spellbookx'],
};

export default userConfig;
```

### In `.commitlintrc.json`

```json
{
  "extends": ["spellbookx"]
}
```

### In `.commitlintrc.yml`

```yaml
extends:
  - spellbookx
```

### In `package.json`

```json
{
  "name": "my-project",
  "commitlint": {
    "extends": ["spellbookx"]
  }
}
```

---

## Git Hooks Integration

To enforce commit message conventions automatically before commits are finalized, configure a git hook manager:

### Using Lefthook

Add a `commit-msg` hook in your `lefthook.yml`:

```yaml
commit-msg:
  commands:
    commitlint:
      run: pnpm exec commitlint --edit {1}
```

### Using Husky

Add a `commit-msg` hook with Husky:

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

---

## Interactive Commits (`cz-git` / `czg` / Commitizen)

`commitlint-config-spellbookx` ships with a preconfigured [`cz-git`](https://cz-git.qbb.sh/config/) prompt. You can use it either with **Commitizen** (`cz`) or standalone with **`czg`** / **`cz-git`** without Commitizen.

### Option 1: Using Commitizen (`cz`)

Configure Commitizen to use the `cz-git` adapter in your `package.json`:

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

### Option 2: Using `czg` or `cz-git` Without Commitizen

If you use [`czg`](https://cz-git.qbb.sh/cli/) or `cz-git` without Commitizen, create a `cz.config.(js|cjs|mjs|ts)` file in your project root (see the [cz-git Configuration Documentation](https://cz-git.qbb.sh/config/)):

#### In `cz.config.mjs` (ES Modules)

```javascript
import { definePrompt } from 'cz-git';
import { prompt } from 'commitlint-config-spellbookx';

export default definePrompt({
  ...prompt,
});
```

Or re-export `prompt` directly:

```javascript
export { prompt as default } from 'commitlint-config-spellbookx';
```

#### In `cz.config.cjs` (CommonJS)

```javascript
const { definePrompt } = require('cz-git');
const { prompt } = require('commitlint-config-spellbookx');

module.exports = definePrompt({
  ...prompt,
});
```

Then add a script in `package.json` or run `czg` directly:

```json
{
  "scripts": {
    "commit": "czg"
  }
}
```

```bash
npx czg
```

---

## License

This project is licensed under the MIT License.

- **Author & Creator**: [Davide Di Criscito](https://github.com/dcdavidev)
- **Copyright**: © 2026 Davide Di Criscito and contributors.

For full details, see the [LICENSE](LICENSE) file.
