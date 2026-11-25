/**
 * @file ESLint configuration tailored for Next.js projects using
 * `@next/eslint-plugin-next`.
 */

import type { Linter } from 'eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextPlugin from '@next/eslint-plugin-next';

/**
 * Next.js flat ESLint configuration applying `@next/eslint-plugin-next` Core Web Vitals rules
 * and ignoring Next.js generated `next-env.d.ts` files.
 */
export const configNext: Linter.Config[] = defineConfig([
  globalIgnores(['**/next-env.d.ts']),
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    extends: [nextPlugin.configs['core-web-vitals']],
  },
]);

export default configNext;
