/* eslint-disable unicorn/no-process-exit */
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';

/**
 * Initializes and configures the VSCode workspace by creating or updating the .vscode directory,
 * and writing recommended extensions and settings files with sensible defaults.
 * @example
 * // Run this function to set up VSCode workspace configuration:
 * actionVSCode();
 */
export function actionVSCode() {
  console.log(chalk.yellow('Initializing VSCode workspace configuration...'));

  const cwd = process.cwd();
  const vscodeDir = path.join(cwd, '.vscode');

  // Create .vscode directory if it doesn't exist
  console.log(chalk.cyan('\n[info] Ensuring .vscode directory exists...'));
  try {
    if (existsSync(vscodeDir)) {
      console.log(chalk.yellow('[warn] .vscode directory already exists.'));
    } else {
      mkdirSync(vscodeDir, { recursive: true });
      console.log(chalk.green('[ok] .vscode directory created successfully.'));
    }
  } catch (error) {
    console.error(
      chalk.red(`[error] Failed to create .vscode directory: ${error}`)
    );
    process.exit(1);
  }

  // extensions.json content
  const extensionsJsonContent = `{
  "recommendations": [
    "nrwl.angular-console",
    "bierner.emojisense",
    "formulahendry.auto-rename-tag",
    "firefox-devtools.vscode-firefox-debug",
    "dsznajder.es7-react-js-snippets",
    "pkief.material-icon-theme",
    "ms-edgedevtools.vscode-edge-devtools",
    "ms-vscode-remote.remote-wsl",
    "streetsidesoftware.code-spell-checker",
    "joshbolduc.commitlint",
    "vivaxy.vscode-conventional-commits",
    "editorconfig.editorconfig",
    "dbaeumer.vscode-eslint",
    "tamasfe.even-better-toml",
    "jimeh.executable-on-save",
    "github.vscode-github-actions",
    "bierner.github-markdown-preview",
    "ecmel.vscode-html-css",
    "lottiefiles.vscode-lottie",
    "motion.motion-vscode-extension",
    "esbenp.prettier-vscode",
    "rpinski.shebang-snippets",
    "foxundermoon.shell-format",
    "timonwong.shellcheck",
    "gruntfuggly.todo-tree",
    "redhat.vscode-yaml"
  ]
}
`;

  // settings.json content
  const settingsJsonContent = `{
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2,
    "editor.rulers": [100]
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2,
    "editor.rulers": [80]
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2,
    "editor.rulers": [80]
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2,
    "editor.rulers": [80]
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2,
    "editor.rulers": [80]
  },
  "[astro]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2,
    "editor.rulers": [100]
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[shellscript]": {
    "editor.defaultFormatter": "foxundermoon.shell-format",
    "editor.tabSize": 2,
    "editor.rulers": [80]
  },
  "[toml]": {
    "editor.defaultFormatter": "tamasfe.even-better-toml",
    "editor.tabSize": 2,
    "editor.rulers": [100]
  },
  "[yaml]": {
    "editor.defaultFormatter": "redhat.vscode-yaml",
    "editor.tabSize": 2,
    "editor.rulers": [80]
  },
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma",
    "editor.tabSize": 2,
    "editor.rulers": [100]
  },
  "emojisense.languages": {
    "git-commit": true,
    "markdown": true,
    "plaintext": true
  },
  "editor.acceptSuggestionOnEnter": "smart",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always",
    "source.fixAll.shellcheck": "explicit"
  },
  "editor.formatOnSave": true,
  "editor.inlineSuggest.enabled": true,
  "editor.renderWhitespace": "all",
  "editor.rulers": [80, 110],
  "editor.tabCompletion": "on",
  "eslint.debug": true,
  "eslint.format.enable": true,
  "eslint.run": "onType",
  "eslint.useFlatConfig": true,
  "eslint.validate": [
    "astro",
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "json",
    "jsonc",
    "markdown"
  ],
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ],
  "shellcheck.run": "onType",
  "cSpell.enabled": true,
  "conventionalCommits.emojiFormat": "emoji",
  "conventionalCommits.gitmoji": true,
  "conventionalCommits.promptBody": true,
  "conventionalCommits.promptFooter": true,
  "conventionalCommits.promptScopes": true,
  "conventionalCommits.scopes": ["nx-recommended"],
  "conventionalCommits.showNewVersionNotes": true,
  "conventionalCommits.storeScopesGlobally": false,
  "commitlint.log.enabled": true,
  "typescript.suggest.paths": false,
  "javascript.suggest.paths": false,
  "exportall.config.barrelName": "index.ts",
  "exportall.config.exportFileExtension": "js",
  "exportall.config.includeFoldersToExport": false,
  "exportall.config.namedExports": true,
  "exportall.config.semis": true,
  "exportall.config.recursive": true,
  "emojisense.markupCompletionsEnabled": true,
  "emojisense.showOnColon": true,
  "emojisense.unicodeCompletionsEnabled": true,
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.turbo": true,
    "**/.nx": true,
    "**/.output": true,
    "**/.next": true,
    "**/.cache": true,
    "**/.vite": true
  },
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/.turbo/**": true,
    "**/.nx/**": true,
    "**/.output/**": true,
    "**/.next/**": true,
    "**/.cache/**": true,
    "**/.vite/**": true,
    "LICENSE": true
  },
  "files.associations": {
    "*.js": "javascript",
    "*.ts": "typescript",
    "*.json": "json",
    "*.jsonc": "jsonc",
    "*.md": "markdown",
    "*.sh": "shellscript",
    "*.toml": "toml",
    "*.yaml": "yaml",
    "*.yml": "yaml",
    ".editorconfig": "editorconfig",
    ".env*": "dotenv",
    ".gitignore": "ignore",
    ".npmrc": "ini",
    ".nvmrc": "plaintext",
    ".czrc": "json",
    ".prettierrc": "json",
    ".prototools": "toml",
    "tsconfig*.json": "jsonc",
    "nx.json": "jsonc",
    "workspace.json": "jsonc",
    "project.json": "jsonc",
    "package.json": "json",
    "pnpm-lock.yaml": "yaml",
    "pnpm-workspace.yaml": "yaml",
    "LICENSE": "plaintext"
  },
  "json.schemas": [
    {
      "fileMatch": ["package.json"],
      "url": "https://json.schemastore.org/package"
    },
    {
      "fileMatch": ["tsconfig*.json"],
      "url": "https://json.schemastore.org/tsconfig"
    },
    {
      "fileMatch": ["nx.json", "workspace.json", "project.json"],
      "url": "https://json.schemastore.org/nx-project"
    },
    {
      "fileMatch": [".prettierrc", ".prettierrc.json"],
      "url": "https://json.schemastore.org/prettierrc"
    },
    {
      "fileMatch": ["lefthook.json", ".lefthook.json", ".config/lefthook.json"],
      "url": "https://raw.githubusercontent.com/evilmartians/lefthook/refs/heads/master/schema.json"
    }
  ],
  "yaml.schemas": {
    "https://json.schemastore.org/github-workflow.json": [
      ".github/workflows/*.yml",
      ".github/workflows/*.yaml"
    ],
    "https://json.schemastore.org/pnpm-workspace.json": ["pnpm-workspace.yaml"],
    "https://raw.githubusercontent.com/evilmartians/lefthook/refs/heads/master/schema.json": [
      "lefthook.yml",
      ".lefthook.yml",
      ".config/lefthook.yml",
      "lefthook.yaml",
      ".lefthook.yaml",
      ".config/lefthook.yaml",
      "lefthook.toml",
      ".lefthook.toml",
      ".config/lefthook.toml"
    ]
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
`;

  // Handle extensions.json
  const extensionsJsonPath = path.join(vscodeDir, 'extensions.json');
  const extensionsJsonBakPath = path.join(vscodeDir, 'extensions.json.bak');

  console.log(chalk.cyan('\n[info] Creating extensions.json...'));
  try {
    if (existsSync(extensionsJsonPath)) {
      // Rotate old backup if present
      if (existsSync(extensionsJsonBakPath)) {
        const ts = new Date().toISOString().replaceAll(/[:.]/g, '-');
        const rotated = `${extensionsJsonBakPath}.${ts}`;
        renameSync(extensionsJsonBakPath, rotated);
        console.log(
          chalk.yellow(
            `[rotate] Rotated existing extensions.json.bak to ${path.basename(rotated)}`
          )
        );
      }
      renameSync(extensionsJsonPath, extensionsJsonBakPath);
      console.log(
        chalk.green(
          '[backup] Backed up existing extensions.json to extensions.json.bak'
        )
      );
    }

    writeFileSync(extensionsJsonPath, extensionsJsonContent, 'utf8');
    console.log(chalk.green('[ok] extensions.json written successfully.'));
  } catch (error) {
    console.error(
      chalk.red(`[error] Failed to create extensions.json: ${error}`)
    );
    process.exit(1);
  }

  // Handle settings.json
  const settingsJsonPath = path.join(vscodeDir, 'settings.json');
  const settingsJsonBakPath = path.join(vscodeDir, 'settings.json.bak');

  console.log(chalk.cyan('\n[info] Creating settings.json...'));
  try {
    if (existsSync(settingsJsonPath)) {
      // Rotate old backup if present
      if (existsSync(settingsJsonBakPath)) {
        const ts = new Date().toISOString().replaceAll(/[:.]/g, '-');
        const rotated = `${settingsJsonBakPath}.${ts}`;
        renameSync(settingsJsonBakPath, rotated);
        console.log(
          chalk.yellow(
            `[rotate] Rotated existing settings.json.bak to ${path.basename(rotated)}`
          )
        );
      }
      renameSync(settingsJsonPath, settingsJsonBakPath);
      console.log(
        chalk.green(
          '[backup] Backed up existing settings.json to settings.json.bak'
        )
      );
    }

    writeFileSync(settingsJsonPath, settingsJsonContent, 'utf8');
    console.log(chalk.green('[ok] settings.json written successfully.'));
  } catch (error) {
    console.error(
      chalk.red(`[error] Failed to create settings.json: ${error}`)
    );
    process.exit(1);
  }

  console.log(chalk.magenta('\n[done] VSCode workspace setup complete!'));
  console.log(
    chalk.cyan(
      '\nReload VSCode to apply the new settings and extension recommendations.'
    )
  );
}
