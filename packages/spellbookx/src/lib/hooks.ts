/**
 * @file hooks.ts
 * Git hook manager selection and generation for the commitlint tool.
 */

import {
  huskyCommitMsgTemplate,
  lefthookTemplate,
} from '../constants/templates.js';
import type {
  ConfigFile,
  HookManager,
  PackageManager,
} from '../types/index.js';

/**
 * Selectable Git hook managers and their display metadata.
 */
export const HOOK_MANAGERS: {
  value: HookManager;
  title: string;
  description: string;
}[] = [
  {
    value: 'lefthook',
    title: 'Lefthook',
    description: 'Fast, cross-platform Git hooks manager',
  },
  {
    value: 'husky',
    title: 'Husky',
    description: 'Modern, widely adopted Git hooks manager',
  },
];

/**
 * Returns the dependency required to install the selected hook manager.
 *
 * @param hookManager - The selected hook manager.
 * @returns Array containing the hook manager package name.
 */
export function getHookManagerDependencies(hookManager: HookManager): string[] {
  return [hookManager];
}

/**
 * Builds the hook configuration files for the selected hook manager.
 *
 * @param hookManager - The selected hook manager.
 * @param packageManager - Package manager used to run hook commands.
 * @returns Configuration files (including executable Git hooks for Husky).
 */
export function getHookManagerFiles(
  hookManager: HookManager,
  packageManager: PackageManager
): ConfigFile[] {
  if (hookManager === 'husky') {
    return [
      {
        path: '.husky/commit-msg',
        content: huskyCommitMsgTemplate(packageManager),
        mode: 0o755,
      },
    ];
  }

  return [
    {
      path: 'lefthook.yml',
      content: lefthookTemplate(packageManager),
    },
  ];
}

/**
 * Returns the `prepare` script that installs the Git hooks.
 *
 * @param hookManager - The selected hook manager.
 * @returns Script entries merged into package.json.
 */
export function getHookManagerScripts(
  hookManager: HookManager
): Record<string, string> {
  return { prepare: hookManager === 'husky' ? 'husky' : 'lefthook install' };
}
