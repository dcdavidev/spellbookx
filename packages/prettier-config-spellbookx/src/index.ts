import type { Config } from "prettier";

type ConfigName =
  | "base"
  | "astro"
  | "astro-prisma"
  | "astro-tailwind"
  | "astro-prisma-tailwind";

export { base } from "./configs/base.js";
export { astro } from "./configs/astro.js";
export { astroPrisma } from "./configs/astro-prisma.js";
export { astroTailwind } from "./configs/astro-tailwind.js";
export { astroPrismaTailwind } from "./configs/astro-prisma-tailwind.js";

import {
  base,
  astro,
  astroPrisma,
  astroTailwind,
  astroPrismaTailwind,
} from "./configs/index.js";

const configs: Record<ConfigName, Config> = {
  base: base,
  astro: astro,
  "astro-prisma": astroPrisma,
  "astro-tailwind": astroTailwind,
  "astro-prisma-tailwind": astroPrismaTailwind,
};

export default configs;
