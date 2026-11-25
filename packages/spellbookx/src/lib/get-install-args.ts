/**
 * @file get-install-args.ts
 * Resolves package manager CLI arguments for installing development dependencies.
 */

import type { PackageManager } from '../types/index.js';

export interface InstallCommand {
  command: string;
  args: string[];
}

/**
 * Appends `@latest` to a package specifier when no explicit version or tag is provided.
 *
 * Handles both unscoped (`eslint`) and scoped (`@spellbookx/recipes`) package names.
 *
 * @param dependency - Package name or versioned specifier.
 * @returns Specifier pinned to `@latest` if no version/tag was already present.
 */
function withLatestTag(dependency: string): string {
  const versionSeparatorIndex = dependency.startsWith('@')
    ? dependency.indexOf('@', 1)
    : dependency.indexOf('@');

  return versionSeparatorIndex === -1 ? `${dependency}@latest` : dependency;
}

/**
 * Returns the command and arguments to install devDependencies at `@latest`.
 *
 * @param pm - Package manager name ('pnpm', 'npm', 'yarn', or 'bun').
 * @param dependencies - List of package dependency names to install.
 * @returns Executable command and CLI argument array.
 */
export function getInstallArgs(
  pm: PackageManager,
  dependencies: string[]
): InstallCommand {
  const resolvedDependencies = dependencies.map((dep) => withLatestTag(dep));

  switch (pm) {
    case 'pnpm': {
      return {
        command: 'pnpm',
        args: ['add', '-D', ...resolvedDependencies],
      };
    }
    case 'bun': {
      return {
        command: 'bun',
        args: ['add', '-d', ...resolvedDependencies],
      };
    }
    case 'yarn': {
      return {
        command: 'yarn',
        args: ['add', '-D', ...resolvedDependencies],
      };
    }
    default: {
      return {
        command: 'npm',
        args: ['install', '--save-dev', ...resolvedDependencies],
      };
    }
  }
}
