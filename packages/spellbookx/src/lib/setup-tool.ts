/**
 * @file Configures an individual tool by writing files and updating
 * package.json.
 */

import { TOOLS_MAP } from '../constants/tools.js';
import type { ToolContext, ToolId } from '../types/index.js';
import { didUpdatePackageJson } from './update-package-json.js';
import { hasWrittenConfigFile } from './write-config.js';

export interface SetupToolOptions {
  cwd?: string;
  overwrite?: boolean;
  context: ToolContext;
}

export interface SetupToolResult {
  toolId: ToolId;
  createdFiles: string[];
}

/**
 * Executes file generation and package.json configuration for a single tool.
 *
 * @param toolId - The tool to configure.
 * @param options - Options specifying target directory, overwrite behavior, and resolution context.
 * @returns Result object containing toolId and list of files created.
 */
export function setupTool(
  toolId: ToolId,
  options: SetupToolOptions
): SetupToolResult {
  const tool = TOOLS_MAP[toolId];
  if (!tool) {
    throw new Error(`Unknown tool: ${toolId}`);
  }

  const createdFiles: string[] = [];

  for (const file of tool.getConfigFiles(options.context)) {
    const written = hasWrittenConfigFile(file.path, file.content, {
      cwd: options.cwd,
      overwrite: options.overwrite,
    });
    if (written) {
      createdFiles.push(file.path);
    }
  }

  const scripts = tool.getScripts?.(options.context);

  if (scripts) {
    didUpdatePackageJson({
      cwd: options.cwd,
      scripts,
    });
  }

  return {
    toolId,
    createdFiles,
  };
}
