# spellbookx

Crafting magical developer toolchains, automation, environments, and wizards for devs. This monorepo provides a collection of shared configurations and plugins for various development tools, ensuring consistency and best practices across projects.

---

## Table of Contents

- [Packages](#packages)
- [License](#license)

---

## Packages

This monorepo contains a small collection of shared configuration packages and plugins used across projects:

- `commitlint-config-spellbookx` - Shared Commitlint configuration enforcing Conventional Commits, interactive prompts (Commitizen/CZ), and parser presets. See ./packages/commitlint-config-spellbookx/README.md
- `cspell-config-spellbookx` - Centralized cspell (spell checker) configuration with curated dictionaries, sensible ignore paths, and ESM-friendly config for monorepos. See ./packages/cspell-config-spellbookx/README.md
- `eslint-plugin-spellbookx` - ESLint plugin and Flat Config bundles (recommended, react, astro, markdown, json, prettier integrations) to standardize linting across JS/TS/React/Astro projects. See ./packages/eslint-plugin-spellbookx/README.md
- `prettier-config-spellbookx` - Prettier presets and opinionated rules with useful plugins (Astro, Prisma, TOML, Tailwind, shell, XML, etc.). Includes multiple presets for different stacks. See ./packages/prettier-config-spellbookx/README.md

---

## License

This project is licensed under the MIT License.

**Copyright (c) 2025 Davide Di Criscito**

For the full details, see the [LICENSE](LICENSE) file.
