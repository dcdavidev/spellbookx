/**
 * @file init.ts
 * Main wizard command initializing Spellbookx configurations.
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
import { detectPackageManager } from '../lib/detect-pm.js';
import { installDeps } from '../lib/install-deps.js';
import {
  promptESLintConfig,
  promptHookManager,
  promptPrettierConfig,
  promptTools,
} from '../lib/prompt-tools.js';
import { setupTool } from '../lib/setup-tool.js';
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
 * Resolves the Prettier preset, ESLint preset, and hook manager choices.
 *
 * Prompts only for the tools that were selected and only when the choice was
 * not provided explicitly and interactive mode is enabled.
 *
 * @param options - The setup options carrying explicit or default choices.
 * @param selectedTools - The tools that will be configured.
 * @param isInteractive - Whether interactive prompts are enabled.
 * @returns The fully resolved choices used to generate configuration files.
 */
async function resolveChoices(
  options: SetupOptions,
  selectedTools: ToolId[],
  isInteractive: boolean
): Promise<ResolvedChoices> {
  const isSelected = (tool: ToolId): boolean => selectedTools.includes(tool);

  const prettierConfig =
    options.prettierConfig ??
    (isInteractive && isSelected('prettier')
      ? await promptPrettierConfig()
      : 'base');

  const eslintConfig =
    options.eslintConfig ??
    (isInteractive && isSelected('eslint')
      ? await promptESLintConfig()
      : 'recommended-spellcheck');

  const hookManager =
    options.hookManager ??
    (isInteractive && isSelected('commitlint')
      ? await promptHookManager()
      : 'lefthook');

  return { prettierConfig, eslintConfig, hookManager };
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

  const context: ToolContext = { choices, packageManager: pm };

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

  if (!options.silent) {
    console.log(
      `\n${chalk.hex(COLORS.primary).bold(`${WIZARD_EMOJI} All set! Your Spellbook is ready.`)}`
    );
    console.log(
      dim(
        `Run ${brand(`${pm} run lint`)} or ${brand(`${pm} run fmt`)} to verify your code styling.\n`
      )
    );
  }

  return {
    selectedTools,
    packageManager: pm,
    choices,
    installedDependencies,
    createdFiles,
  };
}
