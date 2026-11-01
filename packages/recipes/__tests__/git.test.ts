import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import defaultGit, {
  COMMIT_TYPES,
  commitTypes,
  findGitRoot,
  getScopeDescription,
  getScopes,
  getWorkspacesRawPath,
  git,
  SCOPE_RELEASE,
  SCOPE_WORKSPACE,
  scopesArray,
  scopesEnum,
} from '../src/git/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('@spellbookx/recipes/git', () => {
  it('exports git dictionary as both default and named export', () => {
    expect(defaultGit).toBe(git);
    expect(git.COMMIT_TYPES).toBe(COMMIT_TYPES);
    expect(git.commitTypes).toBe(commitTypes);
    expect(commitTypes).toBe(COMMIT_TYPES);
    expect(git.SCOPE_WORKSPACE).toBe(SCOPE_WORKSPACE);
    expect(git.SCOPE_RELEASE).toBe(SCOPE_RELEASE);
    expect(git.scopesArray).toBe(scopesArray);
    expect(git.scopesEnum).toBe(scopesEnum);
    expect(git.findGitRoot).toBe(findGitRoot);
    expect(git.getScopeDescription).toBe(getScopeDescription);
    expect(git.getScopes).toBe(getScopes);
    expect(git.getWorkspacesRawPath).toBe(getWorkspacesRawPath);
  });

  it('exports all 11 standard conventional commit types', () => {
    expect(COMMIT_TYPES).toEqual([
      'feat',
      'fix',
      'docs',
      'style',
      'refactor',
      'perf',
      'test',
      'chore',
      'ci',
      'build',
      'revert',
    ]);
  });

  describe('scopes', () => {
    it('defines workspace and release scope constants', () => {
      expect(SCOPE_WORKSPACE).toBe('workspace');
      expect(SCOPE_RELEASE).toBe('release');
    });

    it.each([
      SCOPE_WORKSPACE,
      SCOPE_RELEASE,
      '@spellbookx/recipes',
      'commitlint-config-spellbookx',
      'cspell-config-spellbookx',
      'cz-config-spellbookx',
      'eslint-plugin-spellbookx',
      'prettier-config-spellbookx',
      'spellbookx',
    ])('includes "%s" in scopesArray and scopesEnum', (scope) => {
      expect(scopesArray).toContain(scope);
      expect(scopesEnum[scope]).toEqual({
        description: getScopeDescription(scope),
      });
    });

    it('returns descriptive text for special and package scopes', () => {
      expect(getScopeDescription(SCOPE_WORKSPACE)).toBe(
        'workspace scope - root files such as config files, root package.json, etc'
      );
      expect(getScopeDescription(SCOPE_RELEASE)).toBe(
        'Special scope for release commits'
      );
      expect(getScopeDescription('my-custom-pkg')).toBe('my-custom-pkg scope');
    });
  });

  describe('workspace discovery', () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = mkdtempSync(path.join(os.tmpdir(), 'sbx-recipes-git-'));
    });

    afterEach(() => {
      rmSync(tempDir, { recursive: true, force: true });
    });

    describe('findGitRoot', () => {
      it('locates the git root directory from a nested package path', () => {
        const root = findGitRoot(__dirname);

        expect(root).not.toBeNull();
        expect(existsSync(path.join(root!, '.git'))).toBe(true);
      });

      it('returns null when no .git directory exists up to filesystem root', () => {
        const root = findGitRoot(tempDir);

        expect(root).toBeNull();
      });
    });

    describe('getWorkspacesRawPath', () => {
      it('parses workspace globs from a JSON file', () => {
        const jsonPath = path.join(tempDir, 'package.json');
        writeFileSync(
          jsonPath,
          JSON.stringify({ workspaces: ['packages/*', 'apps/*'] })
        );

        expect(getWorkspacesRawPath(jsonPath, 'json', 'workspaces')).toEqual([
          'packages/*',
          'apps/*',
        ]);
      });

      it('parses package globs from a YAML file', () => {
        const yamlPath = path.join(tempDir, 'pnpm-workspace.yaml');
        writeFileSync(
          yamlPath,
          'packages:\n  - "packages/*"\n  - "plugins/*"\n'
        );

        expect(getWorkspacesRawPath(yamlPath, 'yaml', 'packages')).toEqual([
          'packages/*',
          'plugins/*',
        ]);
      });

      it('returns an empty array when file does not exist or property is missing', () => {
        expect(
          getWorkspacesRawPath(path.join(tempDir, 'missing.json'), 'json')
        ).toEqual([]);

        const jsonPath = path.join(tempDir, 'empty.json');
        writeFileSync(jsonPath, JSON.stringify({ name: 'no-workspaces' }));
        expect(getWorkspacesRawPath(jsonPath, 'json', 'workspaces')).toEqual(
          []
        );
      });

      it('throws an error when given an unsupported parser type', () => {
        const filePath = path.join(tempDir, 'config.txt');
        writeFileSync(filePath, 'content');

        expect(() => {
          // @ts-expect-error Testing invalid parser runtime check
          getWorkspacesRawPath(filePath, 'xml');
        }).toThrow(/Unsupported parser type: xml/);
      });
    });

    describe('getScopes', () => {
      it('discovers all package scopes in the current monorepo', () => {
        const scopes = getScopes(__dirname);

        expect(scopes).toEqual(
          expect.arrayContaining([
            '@spellbookx/recipes',
            'commitlint-config-spellbookx',
            'cspell-config-spellbookx',
            'cz-config-spellbookx',
            'eslint-plugin-spellbookx',
            'prettier-config-spellbookx',
            'spellbookx',
          ])
        );
      });

      it('discovers scopes from a simulated git repository with workspaces and ignores malformed package.json', () => {
        mkdirSync(path.join(tempDir, '.git'));
        writeFileSync(
          path.join(tempDir, 'package.json'),
          JSON.stringify({ name: 'root-pkg', workspaces: ['packages/*'] })
        );

        const pkgA = path.join(tempDir, 'packages/pkg-a');
        const pkgInvalid = path.join(tempDir, 'packages/pkg-invalid');
        mkdirSync(pkgA, { recursive: true });
        mkdirSync(pkgInvalid, { recursive: true });

        writeFileSync(
          path.join(pkgA, 'package.json'),
          JSON.stringify({ name: '@acme/pkg-a' })
        );
        writeFileSync(path.join(pkgInvalid, 'package.json'), '{ invalid json');

        const scopes = getScopes(tempDir);

        expect(scopes).toContain('root-pkg');
        expect(scopes).toContain('@acme/pkg-a');
      });

      it('throws a fatal error when invoked outside a git repository', () => {
        expect(() => getScopes(tempDir)).toThrow('[FATAL] Not a repository.');
      });
    });
  });
});
