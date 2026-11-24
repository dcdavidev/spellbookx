/**
 * @file prompt.ts
 * Commitizen and cz-git interactive prompt configuration using definePrompt.
 */

import { type CommitizenGitOptions, definePrompt } from 'cz-git';

import { COMMIT_TYPE_DEFINITIONS, scopesArray } from '@spellbookx/recipes/git';

/**
 * Width of the `type:` column, so that every emoji and description line up.
 */
const TYPE_COLUMN_WIDTH =
  Math.max(...COMMIT_TYPE_DEFINITIONS.map(({ type }) => type.length)) + 2;

/**
 * Commit type choices shown by cz-git, e.g. `feat:     ✨  A new feature`.
 */
const types = COMMIT_TYPE_DEFINITIONS.map(({ type, emoji, description }) => ({
  value: type,
  name: `${`${type}:`.padEnd(TYPE_COLUMN_WIDTH)}${emoji}  ${description}`,
  emoji,
}));

/**
 * ANSI 256-color code for the Spellbookx purple theme (`#af5fff`).
 */
export const THEME_COLOR_CODE = '38;5;135';

/**
 * Commitizen and cz-git interactive prompt configuration.
 */
export const prompt: CommitizenGitOptions = definePrompt({
  alias: { fd: 'docs: fix typos' },
  messages: {
    type: "Select the type of change that you're committing:",
    scope: 'Denote the SCOPE of this change (optional):',
    customScope: 'Denote the SCOPE of this change:',
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking:
      'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
    footerPrefixesSelect:
      'Select the ISSUES type of changeList by this change (optional):',
    customFooterPrefix: 'Input ISSUES prefix:',
    footer: 'List any ISSUES by this change. E.g.: #31, #34:\n',
    generatingByAI: 'Generating your AI commit subject...',
    generatedSelectByAI: 'Select suitable subject by AI generated:',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },
  types,
  useEmoji: false,
  emojiAlign: 'center',
  useAI: false,
  aiNumber: 1,
  themeColorCode: THEME_COLOR_CODE,
  scopes: scopesArray,
  enableMultipleScopes: true,
  scopeEnumSeparator: ',',
  allowCustomScopes: true,
  allowEmptyScopes: true,
  customScopesAlign: 'bottom',
  customScopesAlias: 'custom',
  emptyScopesAlias: 'empty',
  upperCaseSubject: null,
  markBreakingChangeMode: false,
  allowBreakingChanges: ['feat', 'fix'],
  breaklineNumber: 100,
  breaklineChar: '|',
  skipQuestions: [],
  issuePrefixes: [
    { value: 'closed', name: 'closed:   ISSUES has been processed' },
  ],
  customIssuePrefixAlign: 'top',
  emptyIssuePrefixAlias: 'skip',
  customIssuePrefixAlias: 'custom',
  allowCustomIssuePrefix: true,
  allowEmptyIssuePrefix: true,
  confirmColorize: true,
  maxHeaderLength: 72,
  maxSubjectLength: Infinity,
  minSubjectLength: 0,
  scopeOverrides: undefined,
  defaultBody: '',
  defaultIssues: '',
  defaultScope: '',
  defaultSubject: '',
})!;

export default prompt;
