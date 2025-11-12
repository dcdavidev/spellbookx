export const PACKAGE_MANAGERS = {
  npm: 'npm',
  pnpm: 'pnpm',
  yarn: 'yarn',
  bun: 'bun',
} as const;

export const PACKAGE_MANAGER = Object.values(PACKAGE_MANAGERS);

export type PackageManager = (typeof PACKAGE_MANAGER)[number];

export const LOCK_FILE = {
  npm: 'package-lock.json',
  pnpm: 'pnpm-lock.yaml',
  yarn: 'yarn.lock',
  bunLock: 'bun.lock',
  bunLockb: 'bun.lockb',
} as const;

export const lockFilesNames = Object.values(LOCK_FILE);

export const lockFileToPackageManager: Record<string, PackageManager> = {
  [LOCK_FILE.npm]: 'npm',
  [LOCK_FILE.yarn]: 'yarn',
  [LOCK_FILE.pnpm]: 'pnpm',
  [LOCK_FILE.bunLock]: 'bun',
  [LOCK_FILE.bunLockb]: 'bun',
} as const;

export const dlx = {
  [PACKAGE_MANAGERS.npm]: 'npx',
  [PACKAGE_MANAGERS.yarn]: 'yarn dlx',
  [PACKAGE_MANAGERS.pnpm]: 'pnpm dlx',
  [PACKAGE_MANAGERS.bun]: 'bunx',
} as const;

export const workspaceMarkers = [
  'pnpm-workspace.yaml',
  '.yarnrc.yml',
  'bunfig.toml',
];
