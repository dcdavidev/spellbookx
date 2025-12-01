import type { Config } from 'prettier';

export { astro } from './configs/astro.js';
export { astroPrisma } from './configs/astro-prisma.js';
export { astroPrismaTailwind } from './configs/astro-prisma-tailwind.js';
export { astroTailwind } from './configs/astro-tailwind.js';
export { base } from './configs/base.js';

import {
  astro,
  astroPrisma,
  astroPrismaTailwind,
  astroTailwind,
  base,
} from './configs/index.js';
import type { SbxPrettierConfig } from './types.js';

const configs: Record<SbxPrettierConfig, Config> = {
  base: base,
  astro: astro,
  'astro-prisma': astroPrisma,
  'astro-tailwind': astroTailwind,
  'astro-prisma-tailwind': astroPrismaTailwind,
};

export default configs;
