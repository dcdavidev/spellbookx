import { describe, expect, it } from 'vitest';

import { getInstallArgs } from '../src/lib/get-install-args.js';

describe('spellbookx (getInstallArgs)', () => {
  const deps = [
    'eslint',
    'eslint-plugin-spellbookx',
    '@spellbookx/recipes',
    'prettier',
  ];
  const expectedDeps = [
    'eslint@latest',
    'eslint-plugin-spellbookx@latest',
    '@spellbookx/recipes@latest',
    'prettier@latest',
  ];

  it.each([
    ['pnpm', 'pnpm', ['add', '-D', ...expectedDeps]],
    ['bun', 'bun', ['add', '-d', ...expectedDeps]],
    ['yarn', 'yarn', ['add', '-D', ...expectedDeps]],
    ['npm', 'npm', ['install', '--save-dev', ...expectedDeps]],
  ] as const)(
    'returns expected command and @latest dev-dependency args for "%s"',
    (pm, expectedCommand, expectedArgs) => {
      const result = getInstallArgs(pm, deps);

      expect(result).toEqual({
        command: expectedCommand,
        args: expectedArgs,
      });
    }
  );

  it('preserves explicit version or tag specifiers for scoped and unscoped packages', () => {
    const result = getInstallArgs('pnpm', [
      'eslint@^10.4.0',
      'prettier@latest',
      '@spellbookx/recipes@2.0.0',
      '@commitlint/cli',
    ]);

    expect(result).toEqual({
      command: 'pnpm',
      args: [
        'add',
        '-D',
        'eslint@^10.4.0',
        'prettier@latest',
        '@spellbookx/recipes@2.0.0',
        '@commitlint/cli@latest',
      ],
    });
  });
});
