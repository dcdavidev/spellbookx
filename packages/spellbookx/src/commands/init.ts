/**
 * @file Main wizard command initializing Spellbookx configurations.
 */

import chalk from 'chalk';

import {
  brand,
  COLORS,
  dim,
  info,
  step,
  success,
  warn,
  WIZARD_EMOJI,
} from '../constants/theme.js';
import { TOOLS, TOOLS_MAP } from '../constants/tools.js';
import { printBanner } from '../lib/banner.js';
import {
  canChooseCSpellLocation,
  getCommitlintConfigPath,
  getCSpellConfigPath,
  getCzgConfigPath,
  normalizeChoices,
} from '../lib/config-files.js';
import { detectPackageManager } from '../lib/detect-pm.js';
import { installDeps } from '../lib/install-deps.js';
import { didSyncLintScript } from '../lib/lint-script.js';
import {
  promptConfigLocation,
  promptCSpellFormat,
  promptESLintConfig,
  promptESLintFormat,
  promptLefthookFormat,
  promptPrettierConfig,
  promptPrettierFormat,
  promptTools,
  shouldConfigureVSCode,
} from '../lib/prompt-tools.js';
import { setupTool } from '../lib/setup-tool.js';
import { getVSCodeConfigFiles } from '../lib/vscode.js';
import { hasWrittenConfigFile } from '../lib/write-config.js';
import type {
  ResolvedChoices,
  SetupOptions,
  SetupResult,
  ToolContext,
  ToolId,
} from '../types/index.js';

/**
 * Detects whether the current process can run interactive prompts.
 *
 * @returns True when both stdin and stdout are attached to a TTY.
 */
function isInteractiveTTY(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

/**
 * Resolves the presets, config file formats, and config file locations.
 *
 * For each selected tool, asks only for the choices that were not provided
 * explicitly, and only in interactive mode. Every other choice takes its
 * default value (the `.config/` layout).
 *
 * - ESLint and Prettier: preset and format. Their files always go in root.
 * - CSpell: format, then the location when the format allows both.
 * - commitlint and czg: the location (the format is always `.mjs`).
 * - Lefthook: format. The file always goes in `.config/`.
 *
 * @param options - The setup options carrying explicit choices.
 * @param selectedTools - The tools that will be configured.
 * @param isInteractive - Whether interactive prompts are enabled.
 * @returns The fully resolved choices used to generate configuration files.
 */
async function resolveChoices(
  options: SetupOptions,
  selectedTools: ToolId[],
  isInteractive: boolean
): Promise<ResolvedChoices> {
  const explicit = options.choices ?? {};
  const choices: Partial<ResolvedChoices> = { ...explicit };
  const shouldAsk = (tool: ToolId, key: keyof ResolvedChoices): boolean =>
    isInteractive &&
    selectedTools.includes(tool) &&
    explicit[key] === undefined;

  if (shouldAsk('eslint', 'eslintConfig')) {
    choices.eslintConfig = await promptESLintConfig();
  }
  if (shouldAsk('eslint', 'eslintFormat')) {
    choices.eslintFormat = await promptESLintFormat();
  }

  if (shouldAsk('prettier', 'prettierConfig')) {
    choices.prettierConfig = await promptPrettierConfig();
  }
  if (shouldAsk('prettier', 'prettierFormat')) {
    choices.prettierFormat = await promptPrettierFormat();
  }

  if (shouldAsk('cspell', 'cspellFormat')) {
    choices.cspellFormat = await promptCSpellFormat();
  }
  const cspellFormat = normalizeChoices(choices).cspellFormat;
  if (
    shouldAsk('cspell', 'cspellLocation') &&
    canChooseCSpellLocation(cspellFormat)
  ) {
    choices.cspellLocation = await promptConfigLocation(
      getCSpellConfigPath(cspellFormat, 'config-dir'),
      getCSpellConfigPath(cspellFormat, 'root')
    );
  }

  if (shouldAsk('commitlint', 'commitlintLocation')) {
    choices.commitlintLocation = await promptConfigLocation(
      getCommitlintConfigPath('config-dir'),
      getCommitlintConfigPath('root')
    );
  }

  if (shouldAsk('czg', 'czgLocation')) {
    choices.czgLocation = await promptConfigLocation(
      getCzgConfigPath('config-dir'),
      getCzgConfigPath('root')
    );
  }

  if (shouldAsk('lefthook', 'lefthookFormat')) {
    choices.lefthookFormat = await promptLefthookFormat();
  }

  return normalizeChoices(choices);
}

/**
 * Runs the Spellbookx toolchain initialization workflow.
 *
 * When no tool options are passed, every tool is selected so that all
 * configuration files are initialized.
 *
 * @param options - Setup options (working directory, tools, package manager, flags).
 * @returns Summary of tools configured and dependencies installed.
 */
export async function runInit(
  options: SetupOptions = {}
): Promise<SetupResult> {
  const cwd = options.cwd || process.cwd();

  if (!options.silent) {
    printBanner();
  }

  // Step 1: Detect package manager
  const pm = options.packageManager || detectPackageManager(cwd);
  if (!options.silent) {
    console.log(info(`Detected package manager: ${brand(pm)}\n`));
  }

  // Step 2: Select tools (all tools by default when no options are passed)
  const isInteractive = options.interactive ?? isInteractiveTTY();
  const selectedTools: ToolId[] =
    options.tools ??
    (isInteractive ? await promptTools() : TOOLS.map((tool) => tool.id));

  const choices = await resolveChoices(options, selectedTools, isInteractive);

  if (selectedTools.length === 0) {
    if (!options.silent) {
      console.log(`\n${warn('No tools selected. Nothing to configure.')}\n`);
    }
    return {
      selectedTools: [],
      packageManager: pm,
      choices,
      installedDependencies: [],
      createdFiles: [],
    };
  }

  const useVSCode =
    options.vscode ?? (isInteractive ? await shouldConfigureVSCode() : false);

  const context: ToolContext = { choices, packageManager: pm, selectedTools };

  if (!options.silent) {
    console.log(`\n${step(1, 2, 'Installing dependencies...')}`);
  }

  // Gather unique dependencies
  const dependenciesSet = new Set<string>();
  for (const toolId of selectedTools) {
    const tool = TOOLS_MAP[toolId];
    if (tool) {
      for (const dep of tool.getDependencies(context)) {
        dependenciesSet.add(dep);
      }
    }
  }

  const allDependencies = [...dependenciesSet];
  let installedDependencies: string[] = [];

  if (!options.skipInstall && allDependencies.length > 0) {
    try {
      await installDeps(pm, allDependencies, {
        cwd,
        silent: options.silent,
      });
      installedDependencies = allDependencies;
    } catch {
      // Configuration files do not depend on the install succeeding, so warn
      // and continue instead of aborting the whole wizard.
      if (!options.silent) {
        console.log(
          warn(
            `Could not install dependencies with ${pm}. Configuration files will still be generated.`
          )
        );
        console.log(
          dim('  Install them later by running the command manually.')
        );
      }
    }
  } else if (!options.silent && options.skipInstall) {
    console.log(dim('  (Skipping package installation as requested)'));
  }

  if (!options.silent) {
    console.log(`\n${step(2, 2, 'Generating configuration files...')}`);
  }

  // Step 3: Configure tools
  const createdFiles: string[] = [];
  for (const toolId of selectedTools) {
    const result = setupTool(toolId, { cwd, context });
    createdFiles.push(...result.createdFiles);
    if (!options.silent) {
      for (const file of result.createdFiles) {
        console.log(`  ${success(`Created ${chalk.bold(file)}`)}`);
      }
    }
  }

  if (useVSCode) {
    const vscodeFiles = getVSCodeConfigFiles({ selectedTools, choices });
    for (const file of vscodeFiles) {
      if (!hasWrittenConfigFile(file.path, file.content, { cwd })) {
        continue;
      }
      createdFiles.push(file.path);
      if (!options.silent) {
        console.log(`  ${success(`Created ${chalk.bold(file.path)}`)}`);
      }
    }
  }

  // The aggregate `lint` script runs every `lint:*` target, including the ones
  // configured by earlier runs.
  didSyncLintScript({ cwd, packageManager: pm });

  if (!options.silent) {
    console.log(
      `\n${chalk.hex(COLORS.primary).bold(`${WIZARD_EMOJI} All set! Your Spellbook is ready.`)}`
    );
    console.log(
      dim(
        `Run ${brand(`${pm} run lint`)} or ${brand(`${pm} run fmt`)} to verify your code styling.`
      )
    );
    if (selectedTools.includes('czg')) {
      // The devDependency pins the version the `commit` script uses; the
      // global install makes `czg` work outside the project scripts too.
      console.log(
        info(
          `Also install czg globally: ${brand('npm install -g czg')}. Then run ${brand(`${pm} run commit`)} to write a commit.`
        )
      );
    }
    console.log('');
  }

  return {
    selectedTools,
    packageManager: pm,
    choices,
    installedDependencies,
    createdFiles,
  };
}
