# Code Conventions

This guide describes the code rules of the Spellbookx monorepo. Most rules are enforced automatically: the repository lints and formats its own code with `eslint-plugin-spellbookx` and `prettier-config-spellbookx`, the same packages that it publishes.

## File Header

Each file should be made like this:

```js
/**
 * @file <file description>
 * @author <github username>
 */
```

## Language and Modules

- Write source code in **TypeScript** with `strict` mode enabled.
- Every package is a pure ECMAScript module (`"type": "module"`). Do not use CommonJS (`require`, `module.exports`).
- The packages use `module: NodeNext`. Relative imports must include the `.js` extension, also in `.ts` files:

  ```ts
  import { configJavascript } from './javascript.js';
  ```

- Import Node.js built-in modules with the `node:` prefix, for example `node:fs` and `node:path`.

## Formatting (Prettier)

The root [`prettier.config.mjs`](../../prettier.config.mjs) uses the `prettier-config-spellbookx/base` preset:

| Option           | Value  |
| :--------------- | :----- |
| `printWidth`     | `80`   |
| `tabWidth`       | `2`    |
| `semi`           | `true` |
| `singleQuote`    | `true` |
| `trailingComma`  | `es5`  |
| `bracketSpacing` | `true` |
| `endOfLine`      | `lf`   |

The preset also formats shell scripts, TOML, INI, `.properties`, XML and `package.json` files (sorted keys). The shared editor settings (UTF-8, LF, 2-space indentation, final newline) are in [`.editorconfig`](../../.editorconfig).

Do not format files by hand: run `pnpm fmt`, or let the pre-commit hook format the staged files.

## Linting (ESLint)

The root [`eslint.config.mjs`](../../eslint.config.mjs) uses the `recommended-spellcheck` preset of `eslint-plugin-spellbookx`. It applies these rules:

### JavaScript and TypeScript

- The recommended rules of `@eslint/js`, `typescript-eslint` and `eslint-plugin-unicorn`.
- **Unused variables** are errors. To keep an unused argument or variable on purpose, start its name with `_`.
- **File names** use `kebab-case`, for example `detect-pm.ts`.
- **Imports and exports are sorted** with `eslint-plugin-simple-import-sort`. The import groups come from `@spellbookx/recipes/imports`: Node.js built-ins first, then frameworks and third-party packages, then monorepo packages (`@spellbookx/*`), and relative imports last.
- **JSDoc**: every function declaration, class and method must have a JSDoc comment with a description (`eslint-plugin-jsdoc`).
- **Dependencies**: `eslint-plugin-node-dependencies` checks that the dependencies are compatible with the `engines` field.
- Some `unicorn` rules are turned off: `no-null`, `prevent-abbreviations`, `name-replacements`, `no-top-level-side-effects`, `no-process-exit` and `no-asterisk-prefix-in-documentation-comments`.

### Other Files

- **JSON**: `@eslint/json` checks `.json`, `.json5` and `.jsonc` files. `tsconfig*.json` and `.vscode/*.json` files are parsed as JSONC, so they can contain comments.
- **`package.json`**: `eslint-plugin-package-json` checks the order of the properties and requires a valid `name`, `version`, `description`, `license`, `keywords` and `bugs`.
- **Markdown**: `@eslint/markdown` checks `.md` files with GitHub Flavored Markdown rules.
- **Empty code**: `eslint-plugin-vuoto` reports empty files, blocks and other unused code.
- **Prettier**: `eslint-plugin-prettier` reports formatting differences as ESLint errors.

### Spelling

`@cspell/eslint-plugin` checks the spelling of identifiers, strings and comments, and `pnpm lint:spelling` checks every file with CSpell. If a word is correct but unknown, add it to [`.config/cspell/custom.txt`](../../.config/cspell/custom.txt), one lowercase word per line.

## Running the Checks

| Command              | What it does                                     |
| :------------------- | :----------------------------------------------- |
| `pnpm lint:code`     | Checks the code with ESLint.                     |
| `pnpm lint:code:fix` | Checks the code and applies the automatic fixes. |
| `pnpm lint:spelling` | Checks the spelling with CSpell.                 |
| `pnpm lint:types`    | Type-checks every package.                       |
| `pnpm fmt`           | Formats all files with Prettier.                 |
| `pnpm fmt:check`     | Checks the formatting and changes nothing.       |

The pre-commit hook runs ESLint and Prettier on the staged files, so most problems are fixed before you commit.
