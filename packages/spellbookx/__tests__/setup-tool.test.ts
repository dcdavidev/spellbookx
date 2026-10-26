import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { setupTool } from '../src/lib/setup-tool.js';
import type { ResolvedChoices, ToolContext } from '../src/types/index.js';

const context = (overrides: Partial<ResolvedChoices> = {}): ToolContext => ({
  packageManager: 'pnpm',
  choices: {
    prettierConfig: 'base',
    eslintConfig: 'recommended-spellcheck',
    hookManager: 'lefthook',
    ...overrides,
  },
});

describe('spellbookx (setupTool)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(os.tmpdir(), 'sbx-setup-tool-'));
    writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify({ name: 'setup-tool-test' })
    );
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('sets up cspell configuration files and package.json scripts', () => {
    const res = setupTool('cspell', { cwd: tempDir, context: context() });

    expect(res.toolId).toBe('cspell');
    expect(res.createdFiles).toEqual([
      'cspell.config.cjs',
      '.config/cspell/custom-dictionary.txt',
    ]);
    expect(existsSync(path.join(tempDir, 'cspell.config.cjs'))).toBe(true);
    expect(
      existsSync(path.join(tempDir, '.config/cspell/custom-dictionary.txt'))
    ).toBe(true);

    const pkg = JSON.parse(
      readFileSync(path.join(tempDir, 'package.json'), 'utf8')
    );
    expect(pkg.scripts.spellcheck).toBeDefined();
  });

  it('sets up commitlint, .czrc, cz-git settings, and lefthook by default', () => {
    const res = setupTool('commitlint', { cwd: tempDir, context: context() });

    expect(res.toolId).toBe('commitlint');
    expect(res.createdFiles).toEqual([
      '.czrc',
      'commitlint.config.mjs',
      'lefthook.yml',
    ]);
    expect(readFileSync(path.join(tempDir, '.czrc'), 'utf8')).toBe(
      '{\n  "path": "cz-git"\n}\n'
    );

    const pkg = JSON.parse(
      readFileSync(path.join(tempDir, 'package.json'), 'utf8')
    );
    expect(pkg.scripts.commit).toBe('cz');
    expect(pkg.scripts['commit:lint']).toBe('commitlint --from=HEAD~1');
    expect(pkg.scripts.prepare).toBe('lefthook install');
    expect(pkg.config.commitizen.path).toBe('cz-git');
  });

  it('writes an executable husky commit-msg hook when husky is selected', () => {
    const res = setupTool('commitlint', {
      cwd: tempDir,
      context: context({ hookManager: 'husky' }),
    });

    expect(res.createdFiles).toContain('.husky/commit-msg');
    expect(res.createdFiles).not.toContain('lefthook.yml');

    const hookPath = path.join(tempDir, '.husky/commit-msg');
    expect(existsSync(hookPath)).toBe(true);
    // The owner-executable bit must be set for Git to run the hook.
    expect(statSync(hookPath).mode & 0o111).toBeGreaterThan(0);

    const pkg = JSON.parse(
      readFileSync(path.join(tempDir, 'package.json'), 'utf8')
    );
    expect(pkg.scripts.prepare).toBe('husky');
  });

  it('sets up eslint flat configuration and lint scripts', () => {
    const res = setupTool('eslint', { cwd: tempDir, context: context() });

    expect(res.toolId).toBe('eslint');
    expect(res.createdFiles).toEqual(['eslint.config.mjs']);

    const content = readFileSync(
      path.join(tempDir, 'eslint.config.mjs'),
      'utf8'
    );
    expect(content).toContain("spellbookx.configs['recommended-spellcheck']");

    const pkg = JSON.parse(
      readFileSync(path.join(tempDir, 'package.json'), 'utf8')
    );
    expect(pkg.scripts.lint).toBeDefined();
  });

  it('generates the requested prettier preset plus .prettierignore and .editorconfig', () => {
    const res = setupTool('prettier', {
      cwd: tempDir,
      context: context({ prettierConfig: 'recommended' }),
    });

    expect(res.toolId).toBe('prettier');
    expect(res.createdFiles).toEqual([
      'prettier.config.mjs',
      '.prettierignore',
      '.editorconfig',
    ]);

    const content = readFileSync(
      path.join(tempDir, 'prettier.config.mjs'),
      'utf8'
    );
    expect(content).toContain('createRequire');
    expect(content).toContain("from 'prettier-config-spellbookx'");

    const pkg = JSON.parse(
      readFileSync(path.join(tempDir, 'package.json'), 'utf8')
    );
    expect(pkg.scripts.fmt).toBeDefined();
  });

  it('throws an error for an unknown tool identifier', () => {
    // @ts-expect-error Testing runtime validation for invalid toolId
    expect(() =>
      setupTool('unknown-tool', { cwd: tempDir, context: context() })
    ).toThrow(/Unknown tool: unknown-tool/);
  });
});
