import type { Linter } from 'eslint';

/**
 * ESLint rule set focused on enforcing and improving JSDoc usage across
 * JavaScript and TypeScript codebases.
 *
 * This configuration encourages consistent documentation of functions,
 * methods, and classes, while avoiding type redundancy when TypeScript
 * already provides type information.
 *
 * **Required plugins:**
 * - eslint-plugin-jsdoc.
 *
 * **Register the plugins above as below:**
 * - jsdoc.
 *
 * **Extend these configs:**
 * - jsdoc.configs['flat/contents-typescript-flavor'],
 * - jsdoc.configs['flat/logical-typescript-flavor'],
 * - jsdoc.configs['flat/requirements-typescript-flavor'],
 * - jsdoc.configs['flat/stylistic-typescript-flavor'],.
 */
export const jsDocRules: Linter.RulesRecord = {
  'jsdoc/require-jsdoc': [
    'warn',
    {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
      },
    },
  ],
  'jsdoc/require-description': 'warn',

  'jsdoc/require-param': 'error',
  'jsdoc/require-returns': 'error',

  'jsdoc/check-param-names': 'error',
  'jsdoc/check-property-names': 'error',
  'jsdoc/check-tag-names': 'error',

  'jsdoc/check-alignment': 'warn',
  'jsdoc/check-indentation': 'warn',
  'jsdoc/require-description-complete-sentence': 'warn',

  'jsdoc/no-undefined-types': 'error',
  'jsdoc/empty-tags': 'error',
  'jsdoc/no-multi-asterisks': 'warn',

  'jsdoc/no-types': 'off',
  'jsdoc/require-param-type': 'off',
  'jsdoc/require-property-type': 'off',
  'jsdoc/require-throws-type': 'off',
  'jsdoc/require-yields-type': 'off',
  'jsdoc/require-returns-type': 'off',

  'jsdoc/tag-lines': [
    'warn',
    'any',
    {
      startLines: 0,
      endLines: 0,
      applyToEndTag: true,
      count: 1,
      tags: {},
      maxBlockLines: null,
    },
  ],
};
