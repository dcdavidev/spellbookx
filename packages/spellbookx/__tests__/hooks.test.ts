import { describe, expect, it } from 'vitest';

import {
  getHookManagerDependencies,
  getHookManagerFiles,
  getHookManagerScripts,
  HOOK_MANAGERS,
} from '../src/lib/hooks.js';

describe('spellbookx (hook managers)', () => {
  it('exposes both lefthook and husky as selectable managers', () => {
    expect(HOOK_MANAGERS.map((manager) => manager.value)).toEqual([
      'lefthook',
      'husky',
    ]);
  });

  it('returns the matching hook manager dependency', () => {
    expect(getHookManagerDependencies('lefthook')).toEqual(['lefthook']);
    expect(getHookManagerDependencies('husky')).toEqual(['husky']);
  });

  it('generates lefthook.yml wired to the selected package manager', () => {
    const files = getHookManagerFiles('lefthook', 'pnpm');

    expect(files).toHaveLength(1);
    expect(files[0]?.path).toBe('lefthook.yml');
    expect(files[0]?.content).toContain('pnpm exec commitlint --edit {1}');
    expect(files[0]?.mode).toBeUndefined();
  });

  it('generates an executable husky commit-msg hook', () => {
    const files = getHookManagerFiles('husky', 'npm');

    expect(files).toHaveLength(1);
    expect(files[0]?.path).toBe('.husky/commit-msg');
    expect(files[0]?.content).toContain('npm exec commitlint --edit "$1"');
    expect(files[0]?.mode).toBe(0o755);
  });

  it('returns the prepare script for each manager', () => {
    expect(getHookManagerScripts('lefthook')).toEqual({
      prepare: 'lefthook install',
    });
    expect(getHookManagerScripts('husky')).toEqual({ prepare: 'husky' });
  });
});
