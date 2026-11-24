/**
 * @file lint-script.ts
 * Keeps the aggregate `lint` script in sync with the `lint:*` scripts.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type { PackageManager } from '../types/index.js';
import { didUpdatePackageJson } from './update-package-json.js';

/**
 * `lint:*` targets that the aggregate `lint` script does not run.
 * Commit messages are checked by the `commit-msg` hook instead.
 */
const EXCLUDED_LINT_TARGETS = new Set(['lint:commits']);

/**
 * Builds the aggregate `lint` script that runs every read-only `lint:TARGET`
 * script, following the `action[:target][:modifier]` naming convention.
 *
 * @param scriptNames - Names of the scripts defined in package.json.
 * @param packageManager - Package manager used to run the scripts.
 * @returns The aggregate command, or undefined when there is nothing to run.
 * @example
 * ```ts
 * getLintAggregateScript(['lint:code', 'lint:code:fix', 'lint:spelling'], 'pnpm');
 * // 'pnpm run lint:code && pnpm run lint:spelling'
 * ```
 */
export function getLintAggregateScript(
  scriptNames: readonly string[],
  packageManager: PackageManager
): string | undefined {
  const targets = scriptNames
    .filter(
      (name) => /^lint:[^:]+$/.test(name) && !EXCLUDED_LINT_TARGETS.has(name)
    )
    .toSorted((a, b) => a.localeCompare(b));

  return targets.length > 0
    ? targets.map((target) => `${packageManager} run ${target}`).join(' && ')
    : undefined;
}

/**
 * Updates the `lint` script in package.json so that it runs every `lint:*`
 * target currently defined.
 *
 * @param options - Working directory and package manager.
 * @param options.cwd - Directory containing package.json.
 * @param options.packageManager - Package manager used to run the scripts.
 * @returns True when the `lint` script was written.
 */
export function didSyncLintScript(options: {
  cwd?: string;
  packageManager: PackageManager;
}): boolean {
  const packageJsonPath = path.resolve(
    options.cwd || process.cwd(),
    'package.json'
  );

  if (!existsSync(packageJsonPath)) {
    return false;
  }

  let scripts: Record<string, string>;
  try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      scripts?: Record<string, string>;
    };
    scripts = pkg.scripts ?? {};
  } catch {
    return false;
  }

  const lint = getLintAggregateScript(
    Object.keys(scripts),
    options.packageManager
  );

  return lint
    ? didUpdatePackageJson({ cwd: options.cwd, scripts: { lint } })
    : false;
}
