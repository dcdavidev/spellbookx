/**
 * @file Unit tests for ESLint flat configuration presets in
 * `eslint-plugin-spellbookx`.
 */
import { describe, expect, it } from 'vitest';

import { configAll } from '../src/configs/all.js';
import { configAstro } from '../src/configs/astro.js';
import { configBase } from '../src/configs/base.js';
import { configCspell } from '../src/configs/cspell.js';
import { configIgnores } from '../src/configs/ignores.js';
import { configJavascript } from '../src/configs/javascript.js';
import { configJson } from '../src/configs/json.js';
import { configMarkdown } from '../src/configs/markdown.js';
import { configNext } from '../src/configs/next.js';
import { configNode } from '../src/configs/node.js';
import { configPrettier } from '../src/configs/prettier.js';
import { configReact } from '../src/configs/react.js';
import { configRecommended } from '../src/configs/recommended.js';
import { configRecommendedSpellcheck } from '../src/configs/recommended-spellcheck.js';
import { configStrict } from '../src/configs/strict.js';
import { configSvelte } from '../src/configs/svelte.js';
import { configVuoto } from '../src/configs/vuoto.js';

describe('eslint-plugin-spellbookx (configs)', () => {
  it.each([
    ['all', configAll],
    ['astro', configAstro],
    ['base', configBase],
    ['cspell', configCspell],
    ['ignores', configIgnores],
    ['javascript', configJavascript],
    ['json', configJson],
    ['markdown', configMarkdown],
    ['next', configNext],
    ['node', configNode],
    ['prettier', configPrettier],
    ['react', configReact],
    ['recommended', configRecommended],
    ['recommended-spellcheck', configRecommendedSpellcheck],
    ['strict', configStrict],
    ['svelte', configSvelte],
    ['vuoto', configVuoto],
  ] as const)('preset "%s" is a non-empty flat config array', (_name, conf) => {
    expect(Array.isArray(conf)).toBe(true);
    expect(conf.length).toBeGreaterThan(0);
  });

  it('includes standard monorepo ignore globs in configIgnores', () => {
    const ignoreEntry = configIgnores.find((entry) => entry.ignores);
    expect(ignoreEntry?.ignores).toBeDefined();
    expect(ignoreEntry?.ignores).toEqual(
      expect.arrayContaining([
        '**/node_modules/**',
        '**/dist/**',
        '**/.turbo/**',
        '**/.git/**',
      ])
    );
  });

  it('targets TSX and JSX files in configReact', () => {
    const reactEntry = configReact.find((entry) => entry.files);
    expect(reactEntry?.files).toContain('**/*.{tsx,jsx}');
  });

  it('configures @next/next Core Web Vitals rules and ignores next-env.d.ts in configNext', () => {
    const ignoreEntry = configNext.find((entry) => entry.ignores);
    expect(ignoreEntry?.ignores).toContain('**/next-env.d.ts');

    const rulesEntry = configNext.find(
      (entry) => entry.rules && '@next/next/no-sync-scripts' in entry.rules
    );
    expect(rulesEntry?.files).toContain('**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}');
    expect(rulesEntry?.rules?.['@next/next/no-sync-scripts']).toBe('error');
    expect(rulesEntry?.rules?.['@next/next/no-html-link-for-pages']).toBe(
      'error'
    );
  });

  it('targets .astro files in configAstro', () => {
    const hasAstroFiles = configAstro.some(
      (entry) =>
        Array.isArray(entry.files) &&
        entry.files.some((f) => typeof f === 'string' && f.includes('astro'))
    );
    expect(hasAstroFiles).toBe(true);
  });

  it('targets .svelte files in configSvelte', () => {
    const hasSvelteFiles = configSvelte.some(
      (entry) =>
        Array.isArray(entry.files) &&
        entry.files.some((f) => typeof f === 'string' && f.includes('svelte'))
    );
    expect(hasSvelteFiles).toBe(true);
  });

  it('configures typescript-eslint strict rules in configStrict', () => {
    const totalRules = configStrict.flatMap((c) => Object.keys(c.rules ?? {}));
    expect(totalRules.length).toBeGreaterThan(20);
  });

  it('composes ignores, javascript, and prettier in configBase', () => {
    expect(configBase).toHaveLength(
      configIgnores.length + configJavascript.length + configPrettier.length
    );
  });

  it('composes ignores, javascript, json, vuoto, and prettier in configNode', () => {
    expect(configNode).toHaveLength(
      configIgnores.length +
        configJavascript.length +
        configJson.length +
        configVuoto.length +
        configPrettier.length
    );
  });

  it('bundles all presets in configAll', () => {
    expect(configAll.length).toBeGreaterThanOrEqual(10);
  });
});
