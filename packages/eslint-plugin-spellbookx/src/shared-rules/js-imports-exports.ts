import type { Linter } from "eslint";

const IMPORT_GROUPS = [
  // dotenv & dotenvx packages
  ["^@dotenvx/dotenvx", "^dotenv"],

  // Side-effect imports (e.g. polyfills)
  [String.raw`^\u0000`],

  // Env imports for React Native, Expo, etc.
  ["^@env"],

  // Node.js built-in modules
  [
    "^assert",
    "^buffer",
    "^child_process",
    "^cluster",
    "^console",
    "^constants",
    "^crypto",
    "^dgram",
    "^dns",
    "^domain",
    "^events",
    "^fs",
    "^http",
    "^https",
    "^inspector",
    "^module",
    "^net",
    "^os",
    "^path",
    "^perf_hooks",
    "^process",
    "^punycode",
    "^querystring",
    "^readline",
    "^repl",
    "^stream",
    "^string_decoder",
    "^timers",
    "^tls",
    "^tty",
    "^url",
    "^util",
    "^v8",
    "^vm",
    "^zlib",
  ],

  // Node.js built-in modules #2
  ["^node:"],

  // Node.js backend frameworks
  [
    "^@fastify",
    "^@hapi/hapi",
    "^@koa/koa",
    "^@nestjs",
    "^express",
    "^fastify",
    "^hapi",
    "^koa",
    "^loopback",
    "^nest",
    "^sails",
  ],

  // Node.js backend middlewares & utilities
  [
    "^body-parser",
    "^connect-redis",
    "^cookie-parser",
    "^cors",
    "^express-rate-limit",
    "^express-session",
    "^helmet",
    "^morgan",
    "^passport",
    String.raw`^pino-`,
    "^redis",
    "^winston",
  ],

  // UI Frameworks (React, Vue, Svelte, etc.)
  ["^@angular", "^react", "^solid-js", "^svelte", "^vue"],

  // React specific packages
  [
    "^@tanstack/router",
    "^react-dom",
    "^react-helmet",
    "^react-intl",
    "^react-router",
    "^react-router-dom",
  ],

  // Full-stack/SSR frameworks (Next.js, Remix, etc.)
  ["^@nuxt/kit", "^@remix-run", "^@sveltejs/kit", "^gatsby", "^next"],

  // React Native & Expo
  [
    "^@expo",
    String.raw`^@expo\/`,
    "^@react-native",
    "^expo",
    String.raw`^expo-`,
    "^react-native",
    "^react-navigation",
  ],

  // State management libraries
  [
    "^@reduxjs/toolkit",
    "^jotai",
    "^mobx",
    "^recoil",
    "^redux",
    "^valtio",
    "^zustand",
  ],

  // Data-fetching libraries
  ["^@apollo/client", "^@tanstack/react-query", "^axios", "^graphql", "^swr"],

  // UI libraries & design systems
  [
    "^@chakra-ui",
    "^@headlessui/react",
    "^@lottiefiles",
    "^@material-ui",
    "^@mui",
    "^@nextui-org/react",
    "^@radix-ui",
    "^antd",
    "^framer-motion",
    "^native-base",
    "^react-native-paper",
    "^shadcn-ui",
    "^tailwindcss",
  ],

  // CSS-in-JS & utility libraries
  [
    "^@emotion",
    "^class-variance-authority",
    "^clsx",
    "^lucide-react",
    "^styled-components",
    "^tailwind-merge",
    "^twin.macro",
    "^tw-animate-css",
  ],

  // Common icon packages
  [
    String.raw`^@expo\/vector-icons`,
    "^@fortawesome",
    "^@tabler/icons-react",
    "^lucide",
    "^react-feather",
    "^react-icons",
    "^react-native-feather",
    "^react-native-vector-icons",
  ],

  // Testing libraries and utilities
  ["^@testing-library", "^cypress", "^jest", "^playwright", "^vitest"],

  // Generic third-party packages (npm scope and plain)
  ["^[a-z]", String.raw`^@\w`],

  // Monorepo/workspace scoped packages
  ["^@my-org/", "^@workspace/"],

  // Asset imports (images, fonts, etc.)
  [
    String.raw`^.+\.(avi|mkv|mov|mp4|webm)$`,
    String.raw`^.+\.(mp3|ogg|wav|weba)$`,
    String.raw`^.+\.(gif|jpe?g|png|svg|webp)$`,
    String.raw`^.+\.lottie$`,
    String.raw`^.+\.(eot|otf|ttf|woff|woff2)$`,
  ],

  // JSON files
  [String.raw`^.+\.json$`],

  // Stylesheets (css, scss, less, etc.)
  [String.raw`^.+\.less$`, String.raw`^.+\.s?css$`],

  // Relative imports (parent, sibling, current)
  [String.raw`^\.?\.\/`],
];

/**
 * ESLint rules focused on enforcing structured and sorted imports and exports.
 * This configuration disables the default 'sort-imports' rule and relies on
 * 'eslint-plugin-simple-import-sort' for predictable grouping and sorting.
 *
 * **Required plugins:**
 * - eslint-plugin-simple-import-sort
 * - eslint-plugin-import.
 *
 * **Register plugins as:**
 * - import: importPlugin
 * - simple-import-sort: simpleImportSort.
 */
export const jsRulesImportsExports: Linter.RulesRecord = {
  // Disable the built-in sort-imports rule in favor of plugin
  "sort-imports": "off",

  // Enforce structured and grouped imports using simple-import-sort
  "simple-import-sort/imports": ["error", { groups: IMPORT_GROUPS }],

  // Enforce sorted exports
  "simple-import-sort/exports": "error",
};
