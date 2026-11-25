/**
 * @file Unit tests for the `spellbookx` CLI program and package exports.
 */
import { describe, expect, it } from 'vitest';

import {
  COLORS,
  createProgram,
  packageJson,
  TOOLS,
  TOOLS_MAP,
  toSetupOptions,
  WIZARD_EMOJI,
} from '../src/index.js';

describe('spellbookx (CLI program & exports)', () => {
  it('creates a Commander program named "spellbookx" with alias "sbx"', () => {
    const program = createProgram();

    expect(program.name()).toBe('spellbookx');
    expect(program.alias()).toBe('sbx');
    expect(program.version()).toBe(packageJson.version);
  });

  it('registers the "init" subcommand with tool, preset, format, and location options', () => {
    const program = createProgram();
    const initCmd = program.commands.find((cmd) => cmd.name() === 'init');

    expect(initCmd).toBeDefined();
    expect(initCmd?.description()).toContain('Initialize');

    const optionFlags = initCmd?.options.map((opt) => opt.long);
    expect(optionFlags).toEqual(
      expect.arrayContaining([
        '--pm',
        '--skip-install',
        '--tools',
        '--cspell',
        '--commitlint',
        '--czg',
        '--eslint',
        '--prettier',
        '--lefthook',
        '--prettier-config',
        '--prettier-format',
        '--eslint-config',
        '--eslint-format',
        '--cspell-format',
        '--lefthook-format',
        '--config-dir',
        '--root',
      ])
    );
    expect(optionFlags).not.toContain('--hook-manager');
  });

  it('parses the format and location flags into choices', () => {
    const program = createProgram();
    const initCmd = program.commands.find((cmd) => cmd.name() === 'init');
    initCmd?.parseOptions([
      '--czg',
      '--lefthook',
      '--cspell-format',
      'json',
      '--lefthook-format',
      'toml',
      '--root',
      'czg',
      'cspell',
    ]);

    const options = toSetupOptions(initCmd?.opts() ?? {});
    expect(options.tools).toEqual(['czg', 'lefthook']);
    expect(options.choices).toMatchObject({
      cspellFormat: 'json',
      lefthookFormat: 'toml',
      czgLocation: 'root',
      cspellLocation: 'root',
    });
    expect(options.choices?.commitlintLocation).toBeUndefined();
  });

  it('rejects unknown formats', () => {
    const program = createProgram();
    const initCmd = program.commands.find((cmd) => cmd.name() === 'init');
    initCmd?.exitOverride().configureOutput({ writeErr: () => {} });

    expect(() => initCmd?.parseOptions(['--cspell-format', 'cjs'])).toThrow();
  });

  it('exposes tool definitions, theme constants, and package metadata', () => {
    expect(WIZARD_EMOJI).toBe('🧙');
    expect(COLORS.primary).toBeDefined();
    expect(Object.keys(TOOLS_MAP)).toEqual([
      'cspell',
      'commitlint',
      'czg',
      'eslint',
      'prettier',
      'lefthook',
    ]);
    expect(TOOLS).toHaveLength(6);
  });
});
