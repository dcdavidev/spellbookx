import type { Linter } from 'eslint';

/**
 * ESLint configuration for JavaScript and TypeScript.
 *
 * This setup replaces the base ESLint `no-unused-vars` rule with
 * `@typescript-eslint/no-unused-vars`, which understands TypeScript syntax
 * (interfaces, types, enums, modules) and avoids false positives.
 * It also enforces clean code style, safe modern JavaScript patterns,
 * and proper documentation through **Prettier**, **Unicorn**, and **JSDoc**.
 *
 * **Required plugins:**
 * - typescript
 * - typescript-eslint
 * - eslint-plugin-unicorn
 * - eslint-plugin-prettier ('eslint-config-prettier' must be installed too)
 * - eslint-plugin-jsdoc.
 *
 * **Register the plugins as follows:**
 * - '@typescript-eslint': tseslint
 * - unicorn: unicornPlugin
 * - prettier: prettierPlugin
 * - jsdoc: jsdoc.
 */
export const jsRulesCommon: Linter.RulesRecord = {
  // TS: allow unused prefixed with "_"
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],

  // Quote/semi conflict resolution (Prettier handles)
  quotes: 'off',
  '@typescript-eslint/quotes': 'off',
  semi: 'off',
  '@typescript-eslint/semi': 'off',

  // Unicorn
  'unicorn/filename-case': ['error', { case: 'kebabCase' }],
  'unicorn/prefer-module': 'error',
  'unicorn/no-new-buffer': 'error',
  'unicorn/no-instanceof-array': 'error',
  'unicorn/prefer-includes': 'error',
  'unicorn/prefer-string-replace-all': 'error',
  'unicorn/prefer-top-level-await': 'off',
  'unicorn/prefer-type-error': 'error',
  'unicorn/throw-new-error': 'error',
  'unicorn/no-null': 'off',
  'unicorn/prevent-abbreviations': 'off',
  'unicorn/explicit-length-check': 'warn',

  // Prettier
  'prettier/prettier': 'error',
};
