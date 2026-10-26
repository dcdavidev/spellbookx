/**
 * @file package-json.ts
 * Reads package metadata for the spellbookx CLI.
 */

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

/**
 * Candidate paths to the CLI package.json.
 *
 * The relative depth differs between the TypeScript sources
 * (`src/lib/package-json.ts`) and the bundled output, where shared modules are
 * emitted directly into `dist/`.
 */
const CANDIDATES = ['../../package.json', '../package.json'];

/**
 * Resolves the first existing package.json among the known candidate paths.
 *
 * @returns Absolute path to the CLI package.json.
 */
function resolvePackagePath(): string {
  for (const relative of CANDIDATES) {
    const candidate = fileURLToPath(new URL(relative, import.meta.url));
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return fileURLToPath(new URL(CANDIDATES[0], import.meta.url));
}

const packagePath = resolvePackagePath();

/**
 * Loaded package.json metadata for spellbookx CLI.
 */
export const packageJson = JSON.parse(readFileSync(packagePath, 'utf8')) as {
  name: string;
  version: string;
  description: string;
};

export default packageJson;
