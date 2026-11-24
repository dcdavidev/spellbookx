/**
 * @file index.ts
 * Main entry point for cz-config-spellbookx.
 * Exports the czg interactive prompt configuration and theme settings.
 */

import type { CommitizenGitOptions } from 'czg';

import { prompt } from './prompt.js';

export { packageJson } from './lib/index.js';
export { prompt, THEME_COLOR_CODE } from './prompt.js';

/**
 * Shareable czg interactive prompt configuration preset.
 */
export const config: CommitizenGitOptions = prompt;

export default config;
