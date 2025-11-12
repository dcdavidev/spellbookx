import { existsSync } from 'node:fs';
import path from 'node:path';

import {
  LOCK_FILE,
  lockFileToPackageManager,
  type PackageManager,
} from '../consts.js';
import chalk from 'chalk';

/**
 * Detects the package manager used in the given directory by checking for known lock files.
 * @param cwd The directory path to check for package manager lock files.
 * @returns The detected package manager name.
 * @example
 * resolvePackageManager('/path/to/my/project');
 */
export function resolvePackageManager(cwd: string): PackageManager {
  for (const lockFile of Object.values(LOCK_FILE)) {
    const lockFilePath = path.join(cwd, lockFile);

    if (existsSync(lockFilePath)) {
      const pm = lockFileToPackageManager[lockFile];
      if (pm) {
        return pm;
      }
    }
  }

  console.log(
    chalk.yellow('No package manager lock file found, falling back to `npm.`')
  );
  return 'npm';
}
