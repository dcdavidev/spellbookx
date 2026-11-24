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
import { DEFAULT_CHOICES } from '../src/lib/config-files.js';
import * as installDepsModule from '../src/lib/install-deps.js';
import * as promptToolsModule from '../src/lib/prompt-tools.js';

describe('spellbookx (runInit)', () => {
  let tempDir: string;

  const readPackageJson = () =>
    JSON.parse(readFileSync(path.join(tempDir, 'package.json'), 'utf8'));

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(os.tmpdir(), 'sbx-init-'));
    writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify({ name: 'init-test' })
    );
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('initializes every tool non-interactively with the .config/ layout', async () => {
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
      'czg',
      'eslint',
      'prettier',
      'lefthook',
    ]);
    expect(res.createdFiles).toEqual([
      '.config/cspell.yml',
      '.config/cspell/custom.txt',
      '.config/commitlint.mjs',
      '.config/cz.mjs',
      'eslint.config.mjs',
      'prettier.config.mjs',
      '.prettierignore',
      '.editorconfig',
      '.config/lefthook.yml',
    ]);
    expect(res.choices).toEqual(DEFAULT_CHOICES);

    for (const legacy of [
      '.czrc',
      'cspell.config.cjs',
      'lefthook.yml',
      '.husky/commit-msg',
    ]) {
      expect(existsSync(path.join(tempDir, legacy))).toBe(false);
    }

    const pkg = readPackageJson();
    expect(pkg.scripts.lint).toBe(
      'pnpm run lint:code && pnpm run lint:spelling'
    );
    expect(pkg.scripts.commit).toBe('czg --config=./.config/cz.mjs');
    expect(pkg.scripts['lint:commits']).toBe(
      'commitlint --config ./.config/commitlint.mjs --from=HEAD~1 --verbose'
    );
    expect(pkg.scripts.prepare).toBe('lefthook install');
    expect(pkg.config).toBeUndefined();
  });

  it('installs czg and never commitizen, cz-git, or husky', async () => {
    const installSpy = vi
      .spyOn(installDepsModule, 'installDeps')
      .mockResolvedValue();

    const res = await runInit({
      cwd: tempDir,
      packageManager: 'pnpm',
      silent: true,
      interactive: false,
    });

    const deps = installSpy.mock.calls[0]?.[1] ?? [];
    expect(deps).toEqual(
      expect.arrayContaining(['czg', 'cz-config-spellbookx', 'lefthook'])
    );
    expect(deps).not.toEqual(
      expect.arrayContaining([
        expect.stringMatching(
          /^(commitizen|cz-git|husky|@cspell\/cspell-types)$/
        ),
      ])
    );
    expect(res.installedDependencies).toEqual(deps);
  });

  it('honors explicit tool selection and installs dependencies', async () => {
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
      choices: { eslintFormat: 'ts' },
    });

    expect(installSpy).toHaveBeenCalledWith(
      'bun',
      expect.arrayContaining([
        'eslint',
        'jiti',
        'prettier',
        'prettier-config-spellbookx',
      ]),
      { cwd: tempDir, silent: true }
    );
    expect(res.selectedTools).toEqual(['eslint', 'prettier']);
    expect(res.createdFiles).toEqual(
      expect.arrayContaining([
        'eslint.config.ts',
        'prettier.config.mjs',
        '.prettierignore',
      ])
    );
  });

  it('writes the root layout from explicit choices', async () => {
    const res = await runInit({
      cwd: tempDir,
      packageManager: 'pnpm',
      skipInstall: true,
      silent: true,
      interactive: false,
      choices: {
        cspellFormat: 'json',
        cspellLocation: 'root',
        commitlintLocation: 'root',
        czgLocation: 'root',
        lefthookFormat: 'json',
        eslintConfig: 'strict',
      },
    });

    expect(res.createdFiles).toEqual(
      expect.arrayContaining([
        'cspell.config.json',
        'commitlint.config.mjs',
        'cz.config.mjs',
        '.config/lefthook.json',
      ])
    );
    expect(
      readFileSync(path.join(tempDir, 'eslint.config.mjs'), 'utf8')
    ).toContain("spellbookx.configs['strict']");

    const lefthook = JSON.parse(
      readFileSync(path.join(tempDir, '.config/lefthook.json'), 'utf8')
    );
    expect(lefthook['commit-msg'].jobs[0].run).toBe(
      'pnpm exec commitlint --edit {1}'
    );

    const pkg = readPackageJson();
    expect(pkg.scripts.commit).toBe('czg');
    expect(pkg.scripts['lint:commits']).toBe(
      'commitlint --from=HEAD~1 --verbose'
    );
  });

  it('always writes a JavaScript CSpell config in the root', async () => {
    const res = await runInit({
      cwd: tempDir,
      tools: ['cspell'],
      skipInstall: true,
      silent: true,
      interactive: false,
      choices: { cspellFormat: 'mjs', cspellLocation: 'config-dir' },
    });

    expect(res.choices.cspellLocation).toBe('root');
    expect(res.createdFiles).toContain('cspell.config.mjs');
  });

  it('asks the preset, format, and location questions in interactive mode', async () => {
    vi.spyOn(promptToolsModule, 'promptTools').mockResolvedValue([
      'cspell',
      'commitlint',
      'czg',
      'eslint',
      'prettier',
      'lefthook',
    ]);
    const eslintConfig = vi
      .spyOn(promptToolsModule, 'promptESLintConfig')
      .mockResolvedValue('react');
    const eslintFormat = vi
      .spyOn(promptToolsModule, 'promptESLintFormat')
      .mockResolvedValue('ts');
    const prettierConfig = vi
      .spyOn(promptToolsModule, 'promptPrettierConfig')
      .mockResolvedValue('base');
    const prettierFormat = vi
      .spyOn(promptToolsModule, 'promptPrettierFormat')
      .mockResolvedValue('mjs');
    const cspellFormat = vi
      .spyOn(promptToolsModule, 'promptCSpellFormat')
      .mockResolvedValue('yaml');
    const lefthookFormat = vi
      .spyOn(promptToolsModule, 'promptLefthookFormat')
      .mockResolvedValue('toml');
    const location = vi
      .spyOn(promptToolsModule, 'promptConfigLocation')
      .mockResolvedValueOnce('root') // CSpell
      .mockResolvedValueOnce('config-dir') // commitlint
      .mockResolvedValueOnce('root'); // czg

    const res = await runInit({
      cwd: tempDir,
      packageManager: 'pnpm',
      skipInstall: true,
      silent: true,
      interactive: true,
    });

    for (const spy of [
      eslintConfig,
      eslintFormat,
      prettierConfig,
      prettierFormat,
      cspellFormat,
      lefthookFormat,
    ]) {
      expect(spy).toHaveBeenCalledTimes(1);
    }
    expect(location.mock.calls).toEqual([
      ['.config/cspell.yml', 'cspell.config.yml'],
      ['.config/commitlint.mjs', 'commitlint.config.mjs'],
      ['.config/cz.mjs', 'cz.config.mjs'],
    ]);
    expect(res.choices).toEqual({
      ...DEFAULT_CHOICES,
      eslintConfig: 'react',
      eslintFormat: 'ts',
      cspellLocation: 'root',
      czgLocation: 'root',
      lefthookFormat: 'toml',
    });
    expect(res.createdFiles).toEqual(
      expect.arrayContaining([
        'cspell.config.yml',
        '.config/commitlint.mjs',
        'cz.config.mjs',
        'eslint.config.ts',
        '.config/lefthook.toml',
      ])
    );
  });

  it('skips the CSpell location question for the JavaScript format', async () => {
    vi.spyOn(promptToolsModule, 'promptTools').mockResolvedValue(['cspell']);
    vi.spyOn(promptToolsModule, 'promptCSpellFormat').mockResolvedValue('mjs');
    const location = vi.spyOn(promptToolsModule, 'promptConfigLocation');

    const res = await runInit({
      cwd: tempDir,
      skipInstall: true,
      silent: true,
      interactive: true,
    });

    expect(location).not.toHaveBeenCalled();
    expect(res.createdFiles).toContain('cspell.config.mjs');
  });

  it('does not ask for choices that were passed explicitly', async () => {
    vi.spyOn(promptToolsModule, 'promptTools').mockResolvedValue(['czg']);
    const location = vi.spyOn(promptToolsModule, 'promptConfigLocation');

    const res = await runInit({
      cwd: tempDir,
      skipInstall: true,
      silent: true,
      interactive: true,
      choices: { czgLocation: 'root' },
    });

    expect(location).not.toHaveBeenCalled();
    expect(res.createdFiles).toEqual(['cz.config.mjs']);
  });

  it('returns an empty result without installing or creating files when no tools are selected', async () => {
    const installSpy = vi
      .spyOn(installDepsModule, 'installDeps')
      .mockResolvedValue();

    const res = await runInit({
      cwd: tempDir,
      tools: [],
      packageManager: 'pnpm',
      skipInstall: false,
      silent: true,
      interactive: false,
    });

    expect(installSpy).not.toHaveBeenCalled();
    expect(res).toEqual({
      selectedTools: [],
      packageManager: 'pnpm',
      choices: DEFAULT_CHOICES,
      installedDependencies: [],
      createdFiles: [],
    });
  });
});
