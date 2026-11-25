/**
 * @file Unit tests for configuration file names and locations in `spellbookx`.
 */
import { describe, expect, it } from 'vitest';

import { cspellConfigTemplate } from '../src/constants/templates.js';
import {
  canChooseCSpellLocation,
  DEFAULT_CHOICES,
  getCommitlintConfigArgument,
  getCommitlintConfigPath,
  getCSpellConfigPath,
  getCzgConfigArgument,
  getCzgConfigPath,
  getESLintConfigPath,
  getLefthookConfigPath,
  getPrettierConfigPath,
  normalizeChoices,
} from '../src/lib/config-files.js';

describe('spellbookx (config file names and locations)', () => {
  it('puts <tool>.config.<ext> names in the root', () => {
    expect(getESLintConfigPath('mjs')).toBe('eslint.config.mjs');
    expect(getESLintConfigPath('ts')).toBe('eslint.config.ts');
    expect(getPrettierConfigPath('mjs')).toBe('prettier.config.mjs');
    expect(getPrettierConfigPath('ts')).toBe('prettier.config.ts');
    expect(getCSpellConfigPath('yaml', 'root')).toBe('cspell.config.yml');
    expect(getCSpellConfigPath('json', 'root')).toBe('cspell.config.json');
    expect(getCommitlintConfigPath('root')).toBe('commitlint.config.mjs');
    expect(getCzgConfigPath('root')).toBe('cz.config.mjs');
  });

  it('puts names that are only the tool name in .config/', () => {
    expect(getCSpellConfigPath('yaml', 'config-dir')).toBe(
      '.config/cspell.yml'
    );
    expect(getCSpellConfigPath('json', 'config-dir')).toBe(
      '.config/cspell.json'
    );
    expect(getCommitlintConfigPath('config-dir')).toBe(
      '.config/commitlint.mjs'
    );
    expect(getCzgConfigPath('config-dir')).toBe('.config/cz.mjs');
    expect(getLefthookConfigPath('yaml')).toBe('.config/lefthook.yml');
    expect(getLefthookConfigPath('json')).toBe('.config/lefthook.json');
    expect(getLefthookConfigPath('toml')).toBe('.config/lefthook.toml');
  });

  it('always writes the JavaScript CSpell config as root cspell.config.mjs', () => {
    expect(canChooseCSpellLocation('mjs')).toBe(false);
    expect(canChooseCSpellLocation('yaml')).toBe(true);
    expect(getCSpellConfigPath('mjs', 'config-dir')).toBe('cspell.config.mjs');
    expect(
      normalizeChoices({ cspellFormat: 'mjs', cspellLocation: 'config-dir' })
        .cspellLocation
    ).toBe('root');
  });

  it('builds the --config flags for files in .config/ only', () => {
    expect(getCommitlintConfigArgument('config-dir')).toBe(
      '--config ./.config/commitlint.mjs '
    );
    expect(getCommitlintConfigArgument('root')).toBe('');
    // czg ignores `--config <path>` with a space, so it must use `=`.
    expect(getCzgConfigArgument('config-dir')).toBe(
      ' --config=./.config/cz.mjs'
    );
    expect(getCzgConfigArgument('root')).toBe('');
  });

  it('fills missing and undefined choices with the defaults', () => {
    expect(normalizeChoices()).toEqual(DEFAULT_CHOICES);
    expect(
      normalizeChoices({ eslintFormat: undefined, lefthookFormat: 'json' })
    ).toEqual({ ...DEFAULT_CHOICES, lefthookFormat: 'json' });
  });

  it('resolves the CSpell dictionary path relative to the config file', () => {
    expect(cspellConfigTemplate('yaml', 'config-dir')).toContain(
      'path: ./cspell/custom.txt'
    );
    expect(cspellConfigTemplate('yaml', 'root')).toContain(
      'path: ./.config/cspell/custom.txt'
    );
    expect(cspellConfigTemplate('mjs', 'root')).toContain(
      "path: './.config/cspell/custom.txt'"
    );
  });
});
