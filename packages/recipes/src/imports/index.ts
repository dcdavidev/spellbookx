/**
 * @file Main exports for `@spellbookx/recipes/imports`.
 * Exposes all modular import groups, types, and the unified `imports` dictionary.
 */

import * as constants from './constants.js';

/**
 * Type of the unified `imports` dictionary.
 */
export interface ImportsDictionary {
  readonly assets: typeof constants.assets;
  readonly backendFrameworks: typeof constants.backendFrameworks;
  readonly backendMiddlewares: typeof constants.backendMiddlewares;
  readonly builtinModules: typeof constants.builtinModules;
  readonly cssInJs: typeof constants.cssInJs;
  readonly dataFetching: typeof constants.dataFetching;
  readonly dotenv: typeof constants.dotenv;
  readonly env: typeof constants.env;
  readonly fullstackFrameworks: typeof constants.fullstackFrameworks;
  readonly icons: typeof constants.icons;
  readonly internalAliases: typeof constants.internalAliases;
  readonly json: typeof constants.json;
  readonly monorepo: typeof constants.monorepo;
  readonly newline: typeof constants.newline;
  readonly nl: typeof constants.nl;
  readonly reactNativeExpo: typeof constants.reactNativeExpo;
  readonly reactPackages: typeof constants.reactPackages;
  readonly relative: typeof constants.relative;
  readonly separator: typeof constants.separator;
  readonly sideEffects: typeof constants.sideEffects;
  readonly stateManagement: typeof constants.stateManagement;
  readonly styles: typeof constants.styles;
  readonly testing: typeof constants.testing;
  readonly thirdParty: typeof constants.thirdParty;
  readonly uiFrameworks: typeof constants.uiFrameworks;
  readonly uiLibraries: typeof constants.uiLibraries;
}

/**
 * Dictionary of all import recipe categories and separator tokens.
 */
export const imports: ImportsDictionary = {
  assets: constants.assets,
  backendFrameworks: constants.backendFrameworks,
  backendMiddlewares: constants.backendMiddlewares,
  builtinModules: constants.builtinModules,
  cssInJs: constants.cssInJs,
  dataFetching: constants.dataFetching,
  dotenv: constants.dotenv,
  env: constants.env,
  fullstackFrameworks: constants.fullstackFrameworks,
  icons: constants.icons,
  internalAliases: constants.internalAliases,
  json: constants.json,
  monorepo: constants.monorepo,
  newline: constants.newline,
  nl: constants.nl,
  reactNativeExpo: constants.reactNativeExpo,
  reactPackages: constants.reactPackages,
  relative: constants.relative,
  separator: constants.separator,
  sideEffects: constants.sideEffects,
  stateManagement: constants.stateManagement,
  styles: constants.styles,
  testing: constants.testing,
  thirdParty: constants.thirdParty,
  uiFrameworks: constants.uiFrameworks,
  uiLibraries: constants.uiLibraries,
};

/**
 * Valid keys in the `imports` dictionary.
 */
export type ImportRecipeKey = keyof ImportsDictionary;

export * from './constants.js';

/**
 * Default export of the unified imports dictionary.
 */
export default imports;
