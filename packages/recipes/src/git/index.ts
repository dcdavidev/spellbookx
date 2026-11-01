/**
 * @file index.ts
 * Main exports for `@spellbookx/recipes/git`.
 * Exposes Conventional Commit types, monorepo scope discovery utilities, and the unified `git` dictionary.
 */

import { COMMIT_TYPES, commitTypes } from './commit-types.js';
import { findGitRoot } from './find-git-root.js';
import { getScopeDescription } from './get-scope-description.js';
import { getScopes } from './get-scopes.js';
import { getWorkspacesRawPath } from './get-workspaces-raw-path.js';
import {
  SCOPE_RELEASE,
  SCOPE_WORKSPACE,
  scopesArray,
  scopesEnum,
} from './scopes.js';

/**
 * Dictionary of all git recipe constants, scope collections, and workspace discovery helpers.
 */
export const git = {
  COMMIT_TYPES,
  commitTypes,
  findGitRoot,
  getScopeDescription,
  getScopes,
  getWorkspacesRawPath,
  SCOPE_RELEASE,
  SCOPE_WORKSPACE,
  scopesArray,
  scopesEnum,
} as const;

/**
 * Valid keys in the `git` dictionary.
 */
export type GitRecipeKey = keyof typeof git;

/**
 * Type of the unified `git` dictionary.
 */
export type GitDictionary = typeof git;

export * from './commit-types.js';
export * from './find-git-root.js';
export * from './get-scope-description.js';
export * from './get-scopes.js';
export * from './get-workspaces-raw-path.js';
export * from './scopes.js';

/**
 * Default export of the unified git dictionary.
 */
export default git;
