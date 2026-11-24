import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  didSyncLintScript,
  getLintAggregateScript,
} from '../src/lib/lint-script.js';

describe('getLintAggregateScript', () => {
  it('runs every lint target, skipping fixes and commit checks', () => {
    expect(
      getLintAggregateScript(
        [
          'fmt',
          'lint',
          'lint:code',
          'lint:code:fix',
          'lint:commits',
          'lint:spelling',
        ],
        'pnpm'
      )
    ).toBe('pnpm run lint:code && pnpm run lint:spelling');
  });

  it('uses the selected package manager', () => {
    expect(getLintAggregateScript(['lint:code'], 'npm')).toBe(
      'npm run lint:code'
    );
  });

  it('returns undefined when there are no lint targets', () => {
    expect(
      getLintAggregateScript(['fmt', 'lint:commits'], 'pnpm')
    ).toBeUndefined();
  });
});

describe('didSyncLintScript', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(os.tmpdir(), 'sbx-lint-script-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('writes the aggregate lint script into package.json', () => {
    writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify({
        name: 'demo',
        scripts: { 'lint:code': 'eslint .', 'lint:spelling': 'cspell .' },
      })
    );

    expect(didSyncLintScript({ cwd: tempDir, packageManager: 'bun' })).toBe(
      true
    );

    const pkg = JSON.parse(
      readFileSync(path.join(tempDir, 'package.json'), 'utf8')
    );
    expect(pkg.scripts.lint).toBe('bun run lint:code && bun run lint:spelling');
  });

  it('does nothing without package.json or lint targets', () => {
    expect(didSyncLintScript({ cwd: tempDir, packageManager: 'pnpm' })).toBe(
      false
    );

    writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify({ name: 'demo', scripts: { fmt: 'prettier .' } })
    );
    expect(didSyncLintScript({ cwd: tempDir, packageManager: 'pnpm' })).toBe(
      false
    );
  });
});
