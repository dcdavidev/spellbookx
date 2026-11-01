import { describe, expect, it } from 'vitest';

import { COMMIT_TYPES, scopesEnum } from '@spellbookx/recipes/git';

import defaultExport, {
  config,
  packageJson,
  prompt,
  rules,
} from '../src/index.js';

describe('commitlint-config-spellbookx (entrypoint)', () => {
  it('exports a valid commitlint UserConfig object as default and named export', () => {
    expect(defaultExport).toBe(config);
    expect(config).toBeTypeOf('object');
    expect(config.extends).toEqual(['@commitlint/config-conventional']);
    expect(config.parserPreset).toBe(
      'conventional-changelog-conventionalcommits'
    );
    expect(config.rules).toBe(rules);
    expect(config.prompt).toBe(prompt);
  });

  it('exposes accurate package metadata', () => {
    expect(packageJson.name).toBe('commitlint-config-spellbookx');
    expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('configures cz-git interactive prompt questions and settings', () => {
    expect(prompt?.settings?.enableMultipleScopes).toBe(true);
    expect(prompt?.settings?.scopeEnumSeparator).toBe(',');
    expect(prompt?.questions?.scope?.enum).toBe(scopesEnum);

    for (const type of COMMIT_TYPES) {
      expect(prompt?.questions?.type?.enum?.[type]).toBeDefined();
    }
  });
});
