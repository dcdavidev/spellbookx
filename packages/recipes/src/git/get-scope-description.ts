/**
 * @file Formats user-facing description strings for commit scopes.
 */

import { SCOPE_RELEASE, SCOPE_WORKSPACE } from './constants.js';

/**
 * Returns a human-readable description for a given commit scope.
 *
 * @param scope - The scope identifier.
 * @returns The description string for the scope.
 * @example
 * ```ts
 * getScopeDescription('workspace');
 * // 'workspace scope - root files such as config files, root package.json, etc'
 * getScopeDescription('release');
 * // 'Special scope for release commits'
 * getScopeDescription('my-package');
 * // 'my-package scope'
 * ```
 */
export function getScopeDescription(scope: string): string {
  if (scope === SCOPE_WORKSPACE) {
    return 'workspace scope - root files such as config files, root package.json, etc';
  }
  return scope === SCOPE_RELEASE
    ? 'Special scope for release commits'
    : `${scope} scope`;
}
