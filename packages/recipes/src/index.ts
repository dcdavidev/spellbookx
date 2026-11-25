/**
 * @file Main entry point for `@spellbookx/recipes`.
 * Re-exports all git recipes, import groups, ignore path groups, types, and unified recipe dictionaries.
 */

import { git, type GitDictionary } from './git/index.js';
import { ignores, type IgnoresDictionary } from './ignores/index.js';
import { imports, type ImportsDictionary } from './imports/index.js';

export * from './git/index.js';
export * from './ignores/index.js';
export * from './imports/index.js';

/**
 * Type of the unified Spellbookx recipes dictionary.
 */
export interface RecipesDictionary {
  readonly git: GitDictionary;
  readonly ignores: IgnoresDictionary;
  readonly imports: ImportsDictionary;
}

/**
 * Unified Spellbookx recipes collection containing `git`, `ignores`, and `imports` dictionaries.
 */
export const recipes: RecipesDictionary = {
  git,
  ignores,
  imports,
};

/**
 * Default export of the unified recipes dictionary bundling `git`, `ignores`, and `imports`.
 */
export default recipes;
