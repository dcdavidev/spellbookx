/**
 * @file rolldown.base.ts
 * Shared Rolldown build configuration for every workspace package.
 *
 * - Every file in `src/` is an entry, and `preserveModules` keeps the module
 *   graph intact, so `dist/` mirrors `src/` one-to-one (no hashed chunks).
 * - Bare imports (npm packages, workspace packages and `node:` built-ins) stay
 *   external. Runtime dependencies are installed by the consumer, not bundled.
 */

import { readdirSync } from 'node:fs';
import path from 'node:path';

import type { RolldownOptions } from 'rolldown';

const SOURCE_EXTENSIONS = new Set(['.ts', '.mts']);

/**
 * Collects every TypeScript source file below `sourceDir` as a Rolldown input.
 *
 * @param sourceDir - Directory containing the package sources.
 * @returns Absolute paths of all source files, excluding declaration files.
 */
function collectEntries(sourceDir: string): string[] {
  return readdirSync(sourceDir, { recursive: true, encoding: 'utf8' })
    .filter(
      (file) =>
        SOURCE_EXTENSIONS.has(path.extname(file)) && !file.endsWith('.d.ts')
    )
    .map((file) => path.join(sourceDir, file))
    .toSorted((a, b) => a.localeCompare(b));
}

/**
 * Returns true for module ids that must not be bundled.
 *
 * @param id - Import specifier as written in the source.
 * @returns Whether the import stays external.
 */
export function isExternal(id: string): boolean {
  return !(id.startsWith('.') || path.isAbsolute(id));
}

/**
 * Creates the Rolldown configuration for the package in the current directory.
 *
 * @param cwd - Package root (defaults to the directory Rolldown runs in).
 * @returns Rolldown options emitting ESM into `dist/`.
 */
export function definePackageBuild(
  cwd: string = process.cwd()
): RolldownOptions {
  const sourceDir = path.join(cwd, 'src');

  return {
    input: collectEntries(sourceDir),
    platform: 'node',
    external: isExternal,
    output: {
      format: 'esm',
      dir: 'dist',
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].js',
    },
  };
}
