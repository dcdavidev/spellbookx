import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_CHOICES } from '../src/lib/config-files.js';
import { setupTool } from '../src/lib/setup-tool.js';
import type {
  ResolvedChoices,
  ToolContext,
  ToolId,
} from '../src/types/index.js';

const ALL_TOOLS: ToolId[] = [
  'cspell',
  'commitlint',
  'czg',
  'eslint',
  'prettier',
  'lefthook',
];

const context = (overrides: Partial<ResolvedChoices> = {}): ToolContext => ({
  packageManager: 'pnpm',
  choices: { ...DEFAULT_CHOICES, ...overrides },
  selectedTools: ALL_TOOLS,
});

describe('spellbookx (setupTool)', () => {
  let tempDir: string;

  const readPackageJson = () =>
    JSON.parse(readFileSync(path.join(tempDir, 'package.json'), 'utf8'));
  const read = (file: string) => readFileSync(path.join(tempDir, file), 'utf8');

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

  it('writes .config/cspell.yml and the word list by default', () => {
    const res = setupTool('cspell', { cwd: tempDir, context: context() });

    expect(res.toolId).toBe('cspell');
    expect(res.createdFiles).toEqual([
      '.config/cspell.yml',
      '.config/cspell/custom.txt',
    ]);
    expect(read('.config/cspell.yml')).toContain('path: ./cspell/custom.txt');
    expect(readPackageJson().scripts['lint:spelling']).toBe(
      'cspell --no-progress --no-summary .'
    );
  });

  it('writes a root cspell.config.json when the root location is chosen', () => {
    const res = setupTool('cspell', {
      cwd: tempDir,
      context: context({ cspellFormat: 'json', cspellLocation: 'root' }),
    });

    expect(res.createdFiles).toContain('cspell.config.json');
    const config = JSON.parse(read('cspell.config.json'));
    expect(config.import).toEqual(['cspell-config-spellbookx']);
    expect(config.dictionaryDefinitions[0].path).toBe(
      './.config/cspell/custom.txt'
    );
  });

  it('writes cspell.config.mjs with defineSbxConfig for the JavaScript format', () => {
    const res = setupTool('cspell', {
      cwd: tempDir,
      context: context({ cspellFormat: 'mjs', cspellLocation: 'root' }),
    });

    expect(res.createdFiles).toContain('cspell.config.mjs');
    const content = read('cspell.config.mjs');
    expect(content).toContain(
      "import { defineSbxConfig } from 'cspell-config-spellbookx';"
    );
    expect(content).not.toContain('require(');
  });

  it('writes .config/commitlint.mjs and passes --config in lint:commits', () => {
    const res = setupTool('commitlint', { cwd: tempDir, context: context() });

    expect(res.createdFiles).toEqual(['.config/commitlint.mjs']);
    expect(read('.config/commitlint.mjs')).toContain(
      "export { default } from 'commitlint-config-spellbookx';"
    );
    expect(readPackageJson().scripts['lint:commits']).toBe(
      'commitlint --config ./.config/commitlint.mjs --from=HEAD~1 --verbose'
    );
  });

  it('writes a root commitlint.config.mjs without --config', () => {
    const res = setupTool('commitlint', {
      cwd: tempDir,
      context: context({ commitlintLocation: 'root' }),
    });

    expect(res.createdFiles).toEqual(['commitlint.config.mjs']);
    expect(readPackageJson().scripts['lint:commits']).toBe(
      'commitlint --from=HEAD~1 --verbose'
    );
  });

  it('writes .config/cz.mjs with definePrompt and passes --config= to czg', () => {
    const res = setupTool('czg', { cwd: tempDir, context: context() });

    expect(res.createdFiles).toEqual(['.config/cz.mjs']);
    const content = read('.config/cz.mjs');
    expect(content).toContain("import { config } from 'cz-config-spellbookx';");
    expect(content).toContain("import { definePrompt } from 'czg';");
    expect(content).toContain('...config');
    expect(content).not.toContain('defineConfig');

    const pkg = readPackageJson();
    expect(pkg.scripts.commit).toBe('czg --config=./.config/cz.mjs');
    expect(pkg.config).toBeUndefined();
    expect(existsSync(path.join(tempDir, '.czrc'))).toBe(false);
  });

  it('writes a root cz.config.mjs and runs czg without flags', () => {
    const res = setupTool('czg', {
      cwd: tempDir,
      context: context({ czgLocation: 'root' }),
    });

    expect(res.createdFiles).toEqual(['cz.config.mjs']);
    expect(readPackageJson().scripts.commit).toBe('czg');
  });

  it('writes .config/lefthook.yml wired to the selected tools', () => {
    const res = setupTool('lefthook', { cwd: tempDir, context: context() });

    expect(res.createdFiles).toEqual(['.config/lefthook.yml']);
    const content = read('.config/lefthook.yml');
    expect(content).toContain(
      "run: 'pnpm exec commitlint --config ./.config/commitlint.mjs --edit {1}'"
    );
    expect(content).toContain('pnpm exec eslint');
    expect(readPackageJson().scripts.prepare).toBe('lefthook install');
    expect(existsSync(path.join(tempDir, '.husky'))).toBe(false);
  });

  it('writes .config/lefthook.toml for the TOML format', () => {
    const res = setupTool('lefthook', {
      cwd: tempDir,
      context: context({ lefthookFormat: 'toml' }),
    });

    expect(res.createdFiles).toEqual(['.config/lefthook.toml']);
    expect(read('.config/lefthook.toml')).toContain('[[commit-msg.jobs]]');
  });

  it('sets up the eslint flat configuration and lint scripts', () => {
    const res = setupTool('eslint', { cwd: tempDir, context: context() });

    expect(res.toolId).toBe('eslint');
    expect(res.createdFiles).toEqual(['eslint.config.mjs']);
    expect(read('eslint.config.mjs')).toContain(
      "spellbookx.configs['recommended-spellcheck']"
    );

    const pkg = readPackageJson();
    expect(pkg.scripts['lint:code']).toBe('eslint --no-warn-ignored .');
    expect(pkg.scripts['lint:code:fix']).toBe(
      'eslint --no-warn-ignored --fix .'
    );
  });

  it('writes eslint.config.ts for the TypeScript format', () => {
    const res = setupTool('eslint', {
      cwd: tempDir,
      context: context({ eslintFormat: 'ts' }),
    });

    expect(res.createdFiles).toEqual(['eslint.config.ts']);
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

    const content = read('prettier.config.mjs');
    expect(content).toContain('createRequire');
    expect(content).toContain("from 'prettier-config-spellbookx'");
    expect(readPackageJson().scripts.fmt).toBeDefined();
  });

  it('writes prettier.config.ts for the TypeScript format', () => {
    const res = setupTool('prettier', {
      cwd: tempDir,
      context: context({ prettierFormat: 'ts' }),
    });

    expect(res.createdFiles).toContain('prettier.config.ts');
  });

  it('throws an error for an unknown tool identifier', () => {
    expect(() =>
      // @ts-expect-error Testing runtime validation for invalid toolId
      setupTool('unknown-tool', { cwd: tempDir, context: context() })
    ).toThrow(/Unknown tool: unknown-tool/);
  });
});
