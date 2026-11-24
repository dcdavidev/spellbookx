# Tests

This guide explains how to build the packages and run the tests, and how to write new tests. Spellbookx uses [Vitest](https://vitest.dev/) for unit and integration tests.

## Build the Packages

The tests run against the built packages, because the packages import each other from their `dist/` folders. Build them first:

```bash
pnpm build
```

You do not have to do this by hand before `pnpm test`: the Turborepo `test` task depends on `build` (see [`turbo.json`](../../turbo.json)), so `pnpm test` builds the packages first. Turborepo caches the results, so unchanged packages are not built or tested again.

## Run the Tests

Run the tests of every package once:

```bash
pnpm test
```

Run the tests in watch mode while you work:

```bash
pnpm test:watch
```

Run the tests of one package only:

```bash
pnpm --filter eslint-plugin-spellbookx test
```

Run one test file only. Pass the file name filter after the script name:

```bash
pnpm --filter spellbookx test banner
```

Bypass the Turborepo cache and run every test again:

```bash
pnpm test --force
```

Each package runs `vitest run --no-fsModuleCache`. There is no Vitest config file: the packages use the Vitest defaults.

## Write Tests

- Every new feature, utility function or bug fix must have tests.
- Put the tests in the `__tests__/` folder at the root of the package, not next to the source files.
- Name each test file after the module that it tests, with the `.test.ts` extension, for example `detect-pm.test.ts` for `src/lib/detect-pm.ts`. Keep each file small and focused on one module.
- Name the top-level `describe` block after the package and the module:

  ```ts
  describe('spellbookx (banner)', () => {
    // ...
  });
  ```

- Import the Vitest functions explicitly. Globals are not enabled:

  ```ts
  import { describe, expect, it, vi } from 'vitest';
  ```

- Import the code under test from `../src/` with the `.js` extension:

  ```ts
  import { getBanner } from '../src/lib/banner.js';
  ```

- Tests that write files must use a temporary folder (`mkdtempSync(path.join(os.tmpdir(), '<prefix>-'))`) and remove it after the test. Do not write files into the repository.
- Restore mocks after each test, for example with `vi.restoreAllMocks()` in `afterEach`.

The tests are type-checked together with the source code by `pnpm lint:types`.

## Continuous Integration

CI runs the tests on every pull request and on every push to `main`, after the build, lint, format and type-check steps. See [`.github/workflows/code-quality-and-tests.yml`](../../.github/workflows/code-quality-and-tests.yml).
