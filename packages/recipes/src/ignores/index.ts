/**
 * @file Main exports for `@spellbookx/recipes/ignores`.
 * Exposes all modular ignore path groups, types, and the unified `ignores` dictionary.
 */

import * as constants from './constants.js';

/**
 * Type of the unified `ignores` dictionary.
 */
export interface IgnoresDictionary {
  readonly all: typeof constants.all;
  readonly core: typeof constants.core;
  readonly go: typeof constants.go;
  readonly lockFiles: typeof constants.lockFiles;
  readonly misc: typeof constants.misc;
  readonly node: typeof constants.node;
  readonly python: typeof constants.python;
  readonly rust: typeof constants.rust;
  readonly toolchains: typeof constants.toolchains;
  readonly windows: typeof constants.windows;
}

/**
 * Dictionary of all ignore recipe categories and complete collections.
 */
export const ignores: IgnoresDictionary = {
  all: constants.all,
  core: constants.core,
  go: constants.go,
  lockFiles: constants.lockFiles,
  misc: constants.misc,
  node: constants.node,
  python: constants.python,
  rust: constants.rust,
  toolchains: constants.toolchains,
  windows: constants.windows,
};

/**
 * Valid keys in the `ignores` dictionary.
 */
export type IgnoreRecipeKey = keyof IgnoresDictionary;

export * from './constants.js';

/**
 * Default export of the unified ignores dictionary.
 */
export default ignores;
