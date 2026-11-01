/**
 * @file index.ts
 * Main entry point for cz-config-spellbookx.
 * Exports cz-git interactive prompt configuration and theme settings.
 */

import type { CommitizenGitOptions } from 'cz-git';

import { prompt } from './prompt.js';

export { packageJson } from './lib/index.js';
export { prompt, THEME_COLOR_CODE } from './prompt.js';

/**
 * Shareable cz-git and Commitizen interactive prompt configuration preset.
 */
export const config: CommitizenGitOptions = prompt;

export default config;
