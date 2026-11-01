# @spellbookx/recipes

Curated configurations, patterns, and recipes for the Spellbookx ecosystem.

## Installation

```bash
npm install --save-dev @spellbookx/recipes
```

## Usage

You can import recipes from the root package or via specific subpaths:

### 1. Import Recipes (`@spellbookx/recipes/imports`)

```typescript
import { imports } from '@spellbookx/recipes/imports';
// or individual constants:
import {
  builtinModules,
  dotenv,
  uiFrameworks,
} from '@spellbookx/recipes/imports';

console.log(imports.dotenv);
console.log(imports.builtinModules);
console.log(imports.uiFrameworks);
console.log(imports.separator); // ''
```

#### Available Import Groups

- `imports.dotenv`
- `imports.sideEffects`
- `imports.env`
- `imports.builtinModules`
- `imports.backendFrameworks`
- `imports.backendMiddlewares`
- `imports.uiFrameworks`
- `imports.reactPackages`
- `imports.fullstackFrameworks`
- `imports.reactNativeExpo`
- `imports.stateManagement`
- `imports.dataFetching`
- `imports.uiLibraries`
- `imports.cssInJs`
- `imports.icons`
- `imports.testing`
- `imports.thirdParty`
- `imports.monorepo`
- `imports.internalAliases`
- `imports.assets`
- `imports.json`
- `imports.styles`
- `imports.relative`
- `imports.separator` (`imports.nl`, `imports.newline`)

---

### 2. Ignore Patterns Recipes (`@spellbookx/recipes/ignores`)

Shared glob patterns for linting, formatting, and spell-checking tools:

```typescript
import { ignorePaths, ignores } from '@spellbookx/recipes/ignores';
// or individual categories:
import {
  core,
  lockFiles,
  node,
  python,
  rust,
  toolchains,
  windows,
} from '@spellbookx/recipes/ignores';

console.log(ignorePaths); // Full list of ignore globs
console.log(ignores.node); // Node.js / web build outputs
console.log(ignores.lockFiles); // Lock files (pnpm, yarn, npm, bun)
```

#### Available Ignore Groups

- `ignores.core`: Licenses, logs, temp, `.DS_Store`
- `ignores.node`: `node_modules`, `dist`, `build`, `.turbo`, `.next`, `.svelte-kit`, caches
- `ignores.lockFiles`: `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`
- `ignores.rust`: `target`, `.cargo`, `Cargo.lock`
- `ignores.go`: `go.sum`, `vendor`, `.gopath`, `go-build`
- `ignores.python`: `__pycache__`, `*.pyc`, `.venv`, `.pytest_cache`, `.ruff_cache`
- `ignores.toolchains`: `.git`, `.vscode`, `.idea`, `.docker`, `.terraform`, `.astro`, etc.
- `ignores.windows`: Zone identifiers, `Thumbs.db`, `desktop.ini`, recycle bins, page files
- `ignores.misc`: `connect.lock`, `.github/instructions/**`, `*.hbs`
- `ignores.all` / `ignorePaths`: Complete merged array of all glob patterns

---

### 3. Git Recipes (`@spellbookx/recipes/git`)

Standard Conventional Commit types, monorepo scope collections, and workspace discovery utilities shared across `commitlint-config-spellbookx` and `cz-config-spellbookx`:

```typescript
import {
  COMMIT_TYPES,
  commitTypes,
  findGitRoot,
  getScopeDescription,
  getScopes,
  getWorkspacesRawPath,
  git,
  SCOPE_RELEASE,
  SCOPE_WORKSPACE,
  scopesArray,
  scopesEnum,
} from '@spellbookx/recipes/git';

console.log(COMMIT_TYPES); // ['feat', 'fix', 'docs', ...]
console.log(scopesArray); // ['workspace', 'release', ...discoveredPackages]
console.log(scopesEnum); // Record<string, { description: string }>
console.log(git.commitTypes);
```

#### Available Git Exports

- `COMMIT_TYPES` / `commitTypes`: All 11 allowed Conventional Commit type strings.
- `SCOPE_WORKSPACE`: Constant `'workspace'`.
- `SCOPE_RELEASE`: Constant `'release'`.
- `scopesArray`: Array of discovered workspace package names plus `'workspace'` and `'release'`.
- `scopesEnum`: Record of scopes mapped to `{ description: string }` for interactive CLI prompts.
- `getScopes(cwd?)`: Scans monorepo configuration files (`package.json`, `pnpm-workspace.yaml`, `lerna.json`) and returns all workspace package names.
- `findGitRoot(startDir?)`: Traverses upwards to locate the root of the current git repository.
- `getScopeDescription(scope)`: Generates a human-friendly description string for a given scope identifier.
- `getWorkspacesRawPath(configPath, parser, property?)`: Parses JSON or YAML configuration files to extract workspace glob patterns.

---

### 4. Unified Root Recipes (`@spellbookx/recipes`)

The root default export bundles `git`, `ignores`, and `imports` dictionaries into a single object:

```typescript
import recipes, { git, ignores, imports } from '@spellbookx/recipes';

console.log(recipes.git.commitTypes);
console.log(recipes.imports.dotenv);
console.log(recipes.ignores.node);
```

---

## License

This project is licensed under the MIT License.

- **Author & Creator**: [Davide Di Criscito](https://github.com/dcdavidev)
- **Copyright**: © 2026 Davide Di Criscito and contributors.

For full details, see the [LICENSE](LICENSE) file.
