/**
 * @file scopes.ts
 * Scopes constants and scope enumeration generator for commitlint and czg.
 */

import { SCOPE_RELEASE, SCOPE_WORKSPACE } from './constants.js';
import { getScopeDescription } from './get-scope-description.js';
import { getScopes } from './get-scopes.js';

/**
 * Discovers the workspace package scopes without throwing.
 *
 * The scopes are computed when this module is imported, so a failure here
 * (for example when the process does not run inside a git repository) must
 * not crash every tool that loads the commit configuration.
 *
 * @returns The discovered package names, or an empty list.
 */
function discoverScopes(): string[] {
  try {
    return getScopes();
  } catch {
    return [];
  }
}

/**
 * Array of all valid commit scopes, including workspace, release, and discovered monorepo packages.
 */
export const scopesArray: string[] = [
  ...new Set([SCOPE_WORKSPACE, SCOPE_RELEASE, ...discoverScopes()]),
];

/**
 * Record of scopes mapped to their human-readable descriptions for the commitlint prompt.
 */
export const scopesEnum: Record<string, { description: string }> =
  Object.fromEntries(
    scopesArray.map((scope) => [
      scope,
      { description: getScopeDescription(scope) },
    ])
  );
