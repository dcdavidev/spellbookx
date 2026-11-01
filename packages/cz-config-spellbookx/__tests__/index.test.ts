import { describe, expect, it } from 'vitest';

import { COMMIT_TYPES, scopesArray } from '@spellbookx/recipes/git';

import defaultExport, {
  config,
  packageJson,
  prompt,
  THEME_COLOR_CODE,
} from '../src/index.js';

describe('cz-config-spellbookx (entrypoint)', () => {
  it('exports a valid cz-git CommitizenGitOptions object as default and named export', () => {
    expect(defaultExport).toBe(config);
    expect(config).toBe(prompt);
    expect(config).toBeTypeOf('object');
    expect(config.themeColorCode).toBe(THEME_COLOR_CODE);
    expect(config.themeColorCode).toBe('38;5;135');
    expect(config.scopes).toBe(scopesArray);
    expect(config.enableMultipleScopes).toBe(true);
    expect(config.scopeEnumSeparator).toBe(',');
    expect(config.maxHeaderLength).toBe(72);
    expect(config.breaklineNumber).toBe(100);
  });

  it('exposes accurate package metadata', () => {
    expect(packageJson.name).toBe('cz-config-spellbookx');
    expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('configures cz-git interactive prompt types and messages', () => {
    expect(Array.isArray(prompt.types)).toBe(true);
    expect(prompt.types).toHaveLength(COMMIT_TYPES.length);

    const definedTypeValues = prompt.types?.map((item) => item.value) ?? [];
    for (const type of COMMIT_TYPES) {
      expect(definedTypeValues).toContain(type);
    }

    expect(prompt.alias).toEqual({ fd: 'docs: fix typos' });
    expect(prompt.messages?.type).toBeDefined();
    expect(prompt.messages?.subject).toBeDefined();
  });
});
