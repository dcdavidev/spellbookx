/**
 * @file commit-types.ts
 * Standard Conventional Commit types supported by Spellbookx.
 */

/**
 * List of allowed commit types based on the Conventional Commits specification.
 */
export const COMMIT_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'chore',
  'ci',
  'build',
  'revert',
] as const;

/**
 * Valid Conventional Commit type string.
 */
export type CommitType = (typeof COMMIT_TYPES)[number];

/**
 * CamelCase alias for `COMMIT_TYPES`.
 */
export const commitTypes = COMMIT_TYPES;

/**
 * Display metadata for a Conventional Commit type.
 */
export interface CommitTypeDefinition {
  /**
  The commit type, e.g. `feat`.
  */
  type: CommitType;
  /**
  Changelog section title.
  */
  title: string;
  /**
  Emoji shown next to the type in interactive prompts.
  */
  emoji: string;
  /**
  One-line description shown in interactive prompts.
  */
  description: string;
}

/**
 * Commit types with their prompt metadata, in the order shown to the user.
 * Shared by `commitlint-config-spellbookx` and `cz-config-spellbookx`.
 */
export const COMMIT_TYPE_DEFINITIONS: readonly CommitTypeDefinition[] = [
  {
    type: 'feat',
    title: 'Features',
    emoji: '✨',
    description: 'A new feature',
  },
  { type: 'fix', title: 'Bug Fixes', emoji: '🐛', description: 'A bug fix' },
  {
    type: 'docs',
    title: 'Documentation',
    emoji: '📖',
    description: 'Documentation only changes',
  },
  {
    type: 'style',
    title: 'Styles',
    emoji: '🎨',
    description: 'Changes that do not affect the meaning of the code',
  },
  {
    type: 'refactor',
    title: 'Code Refactoring',
    emoji: '🧹',
    description: 'A code change that neither fixes a bug nor adds a feature',
  },
  {
    type: 'perf',
    title: 'Performance Improvements',
    emoji: '🚀',
    description: 'A code change that improves performance',
  },
  {
    type: 'test',
    title: 'Tests',
    emoji: '🧪',
    description: 'Adding missing tests or correcting existing tests',
  },
  {
    type: 'build',
    title: 'Builds',
    emoji: '📦',
    description:
      'Changes that affect the build system or external dependencies',
  },
  {
    type: 'ci',
    title: 'Continuous Integrations',
    emoji: '🤖',
    description: 'Changes to our CI configuration files and scripts',
  },
  {
    type: 'chore',
    title: 'Chores',
    emoji: '♻️',
    description: "Other changes that don't modify src or test files",
  },
  {
    type: 'revert',
    title: 'Reverts',
    emoji: '🔙',
    description: 'Reverts a previous commit',
  },
];
