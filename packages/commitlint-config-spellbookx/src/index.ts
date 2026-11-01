/**
 * @file index.ts
 * Main entry point for commitlint-config-spellbookx.
 * Exports conventional commit configuration, rules, and prompt settings.
 */

import type { UserConfig } from '@commitlint/types';

import { prompt } from './prompt.js';
import { rules } from './rules.js';

export { packageJson } from './lib/index.js';
export { prompt } from './prompt.js';
export { rules } from './rules.js';

/**
 * Shareable Commitlint configuration preset enforcing conventional commits.
 */
export const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules,
  prompt,
};

export default config;
