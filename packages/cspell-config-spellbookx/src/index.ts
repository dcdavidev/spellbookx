import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CSpellSettings } from 'cspell';

import { ignorePaths } from './ignore-paths.js';
import { words } from './words.js';

const $filename = fileURLToPath(import.meta.url);
const $dirname = path.dirname($filename);

const pkg = JSON.parse(
  readFileSync(path.join($dirname, '..', 'package.json'), 'utf8')
);

export default {
  version: '0.2',

  name: pkg.name, // The name of this config

  enabled: true,
  enableGlobDot: true,

  language: 'en,es,it,fr,de',

  loadDefaultConfiguration: true,

  ignorePaths: ignorePaths,

  allowCompoundWords: true,

  // list of featured dictionaries
  dictionaries: [
    // General dictionaries
    'en-gb',
    'en_US',
    'es-es',
    'it-it',
    'fr-fr',
    'de-de',
    'companies',
    'softwareTerms',
    'misc',

    // Programming languages
    'typescript',
    'node',
    'php',
    'go',
    'python',
    'powershell',
    'html',
    'css',
    'csharp',
    'latex',
    'bash',

    // others
    'fonts',
    'fileTypes',
    'npm',
  ],

  words: words,
} satisfies CSpellSettings;
