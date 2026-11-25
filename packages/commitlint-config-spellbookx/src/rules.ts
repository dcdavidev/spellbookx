/**
 * @file Commitlint rule definitions for enforcing conventional commits.
 */

import type { QualifiedRules } from '@commitlint/types';

import { COMMIT_TYPES, scopesArray } from '@spellbookx/recipes/git';

/**
 * Standard commitlint rules configuration.
 */
export const rules: QualifiedRules = {
  'type-enum': [2, 'always', [...COMMIT_TYPES]],
  // Only `,` separates scopes, the separator the czg prompt writes. The
  // default delimiters also split on `/` and `\`, which breaks scoped
  // package names such as `@spellbookx/recipes` in a list of scopes.
  'scope-enum': [2, 'always', { scopes: scopesArray, delimiters: [','] }],
  'subject-empty': [2, 'never'],
  'subject-full-stop': [2, 'never', '.'],
  'header-max-length': [2, 'always', 72],
  'body-max-line-length': [2, 'always', 100],
  'footer-max-line-length': [2, 'always', 100],
};
