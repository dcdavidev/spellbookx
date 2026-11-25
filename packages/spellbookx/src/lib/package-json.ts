/**
 * @file Reads package metadata for the spellbookx CLI.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

// `src/lib/package-json.ts` and `dist/lib/package-json.js` sit at the same
// depth, because the build preserves the source layout.
const packagePath = fileURLToPath(
  new URL('../../package.json', import.meta.url)
);

/**
 * Loaded package.json metadata for spellbookx CLI.
 */
export const packageJson = JSON.parse(readFileSync(packagePath, 'utf8')) as {
  name: string;
  version: string;
  description: string;
};

export default packageJson;
