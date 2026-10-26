import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { runInit } from '../src/commands/init.js';
import * as installDepsModule from '../src/lib/install-deps.js';
import * as promptToolsModule from '../src/lib/prompt-tools.js';

describe('spellbookx (runInit)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(os.tmpdir(), 'sbx-init-'));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('initializes every tool non-interactively when no options are passed', async () => {
    writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify({ name: 'init-all-test' })
    );

    const res = await runInit({
      cwd: tempDir,
      packageManager: 'pnpm',
      skipInstall: true,
      silent: true,
      interactive: false,
    });

    expect(res.selectedTools).toEqual([
      'cspell',
      'commitlint',
      'eslint',
      'prettier',
    ]);
    expect(res.createdFiles).toEqual(
      expect.arrayContaining([
        'cspell.config.cjs',
        '.czrc',
        'commitlint.config.mjs',
        'lefthook.yml',
        'eslint.config.mjs',
        'prettier.config.mjs',
        '.prettierignore',
        '.editorconfig',
      ])
    );
    expect(res.choices).toEqual({
      prettierConfig: 'base',
      eslintConfig: 'recommended-spellcheck',
      hookManager: 'lefthook',
    });
    expect(existsSync(path.join(tempDir, 'eslint.config.mjs'))).toBe(true);

    const pkg = JSON.parse(
      readFileSync(path.join(tempDir, 'package.json'), 'utf8')
    );
    expect(pkg.scripts.lint).toBeDefined();
    expect(pkg.scripts.fmt).toBeDefined();
    expect(pkg.scripts.spellcheck).toBeDefined();
    expect(pkg.scripts.commit).toBe('cz');
  });

  it('honors explicit tool selection and installs dependencies', async () => {
    writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify({ name: 'init-subset-test' })
    );

    const installSpy = vi
      .spyOn(installDepsModule, 'installDeps')
      .mockResolvedValue();

    const res = await runInit({
      cwd: tempDir,
      tools: ['eslint', 'prettier'],
      packageManager: 'bun',
      skipInstall: false,
      silent: true,
      interactive: false,
    });

    expect(installSpy).toHaveBeenCalledWith(
      'bun',
      expect.arrayContaining([
        'eslint',
        'prettier',
        'prettier-config-spellbookx',
      ]),
      { cwd: tempDir, silent: true }
    );
    expect(res.selectedTools).toEqual(['eslint', 'prettier']);
    expect(res.createdFiles).toEqual(
      expect.arrayContaining([
        'eslint.config.mjs',
        'prettier.config.mjs',
        '.prettierignore',
      ])
    );
    expect(existsSync(path.join(tempDir, 'cspell.config.cjs'))).toBe(false);
  });

  it('resolves presets and the hook manager from explicit options', async () => {
    writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify({ name: 'init-choices-test' })
    );

    const res = await runInit({
      cwd: tempDir,
      tools: ['prettier', 'eslint', 'commitlint'],
      packageManager: 'pnpm',
      skipInstall: true,
      silent: true,
      interactive: false,
      prettierConfig: 'recommended',
      eslintConfig: 'strict',
      hookManager: 'husky',
    });

    expect(res.choices).toEqual({
      prettierConfig: 'recommended',
      eslintConfig: 'strict',
      hookManager: 'husky',
    });

    expect(
      readFileSync(path.join(tempDir, 'eslint.config.mjs'), 'utf8')
    ).toContain("spellbookx.configs['strict']");
    expect(existsSync(path.join(tempDir, '.husky/commit-msg'))).toBe(true);
    expect(existsSync(path.join(tempDir, 'lefthook.yml'))).toBe(false);
  });

  it('prompts for tools when interactive and no tools are passed', async () => {
    writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify({ name: 'init-interactive-test' })
    );

    const promptSpy = vi
      .spyOn(promptToolsModule, 'promptTools')
      .mockResolvedValue(['cspell']);
    const installSpy = vi
      .spyOn(installDepsModule, 'installDeps')
      .mockResolvedValue();

    const res = await runInit({
      cwd: tempDir,
      packageManager: 'bun',
      skipInstall: false,
      silent: true,
      interactive: true,
    });

    expect(promptSpy).toHaveBeenCalledTimes(1);
    expect(installSpy).toHaveBeenCalledWith(
      'bun',
      expect.arrayContaining(['cspell', 'cspell-config-spellbookx']),
      { cwd: tempDir, silent: true }
    );
    expect(res.selectedTools).toEqual(['cspell']);
    expect(res.createdFiles).toContain('cspell.config.cjs');
  });

  it('returns an empty result without installing or creating files when no tools are selected', async () => {
    const installSpy = vi
      .spyOn(installDepsModule, 'installDeps')
      .mockResolvedValue();

    const res = await runInit({
      cwd: tempDir,
      tools: [],
      skipInstall: false,
      silent: true,
      interactive: false,
    });

    expect(installSpy).not.toHaveBeenCalled();
    expect(res).toEqual({
      selectedTools: [],
      packageManager: 'pnpm',
      choices: {
        prettierConfig: 'base',
        eslintConfig: 'recommended-spellcheck',
        hookManager: 'lefthook',
      },
      installedDependencies: [],
      createdFiles: [],
    });
  });
});
