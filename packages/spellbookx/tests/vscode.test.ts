/**
 * @file Unit tests for VS Code settings and extensions generation in `spellbookx`.
 */
import { describe, expect, it } from 'vitest';

import { DEFAULT_CHOICES } from '../src/lib/config-files.js';
import {
  buildVSCodeExtensions,
  buildVSCodeSettings,
  getVSCodeConfigFiles,
} from '../src/lib/vscode.js';
import type { ResolvedChoices } from '../src/types/index.js';

const choices = (
  overrides: Partial<ResolvedChoices> = {}
): ResolvedChoices => ({
  ...DEFAULT_CHOICES,
  ...overrides,
});

describe('spellbookx (vscode)', () => {
  it('returns null settings when only non-editor tools are selected', () => {
    expect(
      buildVSCodeSettings({
        selectedTools: ['commitlint', 'czg', 'lefthook'],
        choices: choices(),
      })
    ).toBeNull();
  });

  it('builds Prettier, ESLint, and CSpell settings when all tools are selected', () => {
    const settings = buildVSCodeSettings({
      selectedTools: [
        'cspell',
        'commitlint',
        'czg',
        'eslint',
        'prettier',
        'lefthook',
      ],
      choices: choices(),
    });

    expect(settings).toMatchObject({
      'editor.defaultFormatter': 'esbenp.prettier-vscode',
      'editor.formatOnSave': true,
      'editor.codeActionsOnSave': {
        'source.fixAll.eslint': 'explicit',
      },
      'eslint.validate': [
        'javascript',
        'javascriptreact',
        'typescript',
        'typescriptreact',
        'json',
        'jsonc',
      ],
      'eslint.workingDirectories': [{ mode: 'auto' }],
      'cSpell.enabled': true,
      '[typescript]': {
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
      },
    });
  });

  it('includes framework languages in eslint.validate for astro, svelte, and all presets', () => {
    const astroSettings = buildVSCodeSettings({
      selectedTools: ['eslint'],
      choices: choices({ eslintConfig: 'astro' }),
    });
    expect(astroSettings?.['eslint.validate']).toContain('astro');
    expect(astroSettings?.['eslint.validate']).not.toContain('svelte');

    const allSettings = buildVSCodeSettings({
      selectedTools: ['eslint'],
      choices: choices({ eslintConfig: 'all' }),
    });
    expect(allSettings?.['eslint.validate']).toEqual(
      expect.arrayContaining(['astro', 'svelte'])
    );
  });

  it('builds recommendations tailored to selected tools and YAML formats', () => {
    expect(
      buildVSCodeExtensions({
        selectedTools: ['czg'],
        choices: choices(),
      })
    ).toBeNull();

    expect(
      buildVSCodeExtensions({
        selectedTools: ['lefthook'],
        choices: choices({ lefthookFormat: 'toml' }),
      })
    ).toBeNull();

    expect(
      buildVSCodeExtensions({
        selectedTools: [
          'cspell',
          'commitlint',
          'czg',
          'eslint',
          'prettier',
          'lefthook',
        ],
        choices: choices({ cspellFormat: 'yaml', lefthookFormat: 'yaml' }),
      })
    ).toEqual({
      recommendations: [
        'dbaeumer.vscode-eslint',
        'editorconfig.editorconfig',
        'esbenp.prettier-vscode',
        'joshbolduc.commitlint',
        'redhat.vscode-yaml',
        'streetsidesoftware.code-spell-checker',
      ],
    });

    expect(
      buildVSCodeExtensions({
        selectedTools: ['cspell', 'lefthook'],
        choices: choices({ cspellFormat: 'json', lefthookFormat: 'toml' }),
      })
    ).toEqual({
      recommendations: ['streetsidesoftware.code-spell-checker'],
    });
  });

  it('creates valid JSON config files and omits settings when none apply', () => {
    const commitlintOnly = getVSCodeConfigFiles({
      selectedTools: ['commitlint'],
      choices: choices(),
    });
    expect(commitlintOnly.map((file) => file.path)).toEqual([
      '.vscode/extensions.json',
    ]);
    expect(JSON.parse(commitlintOnly[0]?.content ?? '')).toEqual({
      recommendations: ['joshbolduc.commitlint'],
    });

    const full = getVSCodeConfigFiles({
      selectedTools: ['eslint', 'prettier', 'cspell'],
      choices: choices(),
    });
    expect(full.map((file) => file.path)).toEqual([
      '.vscode/settings.json',
      '.vscode/extensions.json',
    ]);
    expect(JSON.parse(full[0]?.content ?? '')['cSpell.enabled']).toBe(true);
    expect(JSON.parse(full[1]?.content ?? '').recommendations).toEqual([
      'dbaeumer.vscode-eslint',
      'editorconfig.editorconfig',
      'esbenp.prettier-vscode',
      'redhat.vscode-yaml',
      'streetsidesoftware.code-spell-checker',
    ]);
  });
});
