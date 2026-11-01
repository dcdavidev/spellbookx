import { describe, expect, it } from 'vitest';

import * as subpathGit from '../src/git/index.js';
import * as subpathIgnores from '../src/ignores/index.js';
import * as subpathImports from '../src/imports/index.js';
import defaultExport, { git, ignores, imports, recipes } from '../src/index.js';

describe('@spellbookx/recipes (root index)', () => {
  it('bundles git, ignores, and imports in the default export', () => {
    expect(defaultExport).toBe(recipes);
    expect(defaultExport.git).toBe(git);
    expect(defaultExport.ignores).toBe(ignores);
    expect(defaultExport.imports).toBe(imports);
  });

  it('exposes a named recipes export matching the default export', () => {
    expect(recipes).toEqual({
      git,
      ignores,
      imports,
    });
  });

  it('re-exports the git dictionary matching the ./git subpath', () => {
    expect(git).toBeDefined();
    expect(git).toBe(subpathGit.git);
    expect(git).toBe(subpathGit.default);
  });

  it('re-exports the imports dictionary matching the ./imports subpath', () => {
    expect(imports).toBeDefined();
    expect(imports).toBe(subpathImports.imports);
    expect(imports).toBe(subpathImports.default);
  });

  it('re-exports the ignores dictionary matching the ./ignores subpath', () => {
    expect(ignores).toBeDefined();
    expect(ignores).toBe(subpathIgnores.ignores);
    expect(ignores).toBe(subpathIgnores.default);
  });
});
