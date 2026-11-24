/**
 * @file prompt.ts
 * commitlint prompt questions and settings (the `prompt` field of the commitlint config).
 */

import type { UserConfig } from '@commitlint/types';

import { COMMIT_TYPE_DEFINITIONS, scopesEnum } from '@spellbookx/recipes/git';

/**
 * Commit types keyed by type, in the shape expected by the commitlint prompt.
 */
const typeEnum = Object.fromEntries(
  COMMIT_TYPE_DEFINITIONS.map(({ type, description, title, emoji }) => [
    type,
    { description, title, emoji },
  ])
);

/**
 * commitlint interactive prompt configuration.
 */
export const prompt: UserConfig['prompt'] = {
  settings: {
    enableMultipleScopes: true,
    scopeEnumSeparator: ',',
  },
  messages: {
    skip: ':skip',
    max: 'upper %d chars',
    min: '%d chars at least',
    emptyWarning: 'can not be empty',
    upperLimitWarning: 'over limit',
    lowerLimitWarning: 'below limit',
  },
  questions: {
    type: {
      description: "Select the type of change that you're committing:",
      enum: typeEnum,
    },
    scope: {
      description:
        'Select the scope(s) of the change (use arrow keys or space to select multiple)',
      enum: scopesEnum,
    },
    subject: {
      description: 'Write a short, imperative tense description of the change',
    },
    body: { description: 'Provide a longer description of the change' },
    isBreaking: { description: 'Are there any breaking changes?' },
    breakingBody: { description: 'Describe the breaking changes with body' },
    breaking: { description: 'Describe the breaking changes' },
    isIssueAffected: {
      description: 'Does this change affect any open issues?',
    },
    issuesBody: {
      description: 'If issues are closed, enter longer description',
    },
    issues: { description: 'Add issue references (e.g., "fix #123")' },
  },
};
