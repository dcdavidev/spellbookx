# prettier-config-spellbookx

Shared Prettier configuration — harmonizing code and text formatting across JS, TS, Markdown, YAML, TOML, Prisma, and shell scripts.  
Clean. Opinionated. Always consistent.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Resources](#resources)
- [License](#license)

---

## Features

- **Plugins**
  - [`prettier-plugin-sh`](https://github.com/un-ts/prettier/tree/master/packages/prettier-plugin-sh) → Formats shell scripts (`.sh`).
  - [`prettier-plugin-toml`](https://github.com/bd82/toml-tools/tree/master/packages/prettier-plugin-toml) → Formats `.toml` files.
  - [`prettier-plugin-ini`](https://github.com/kddnewton/prettier-plugin-ini) → Formats `.ini` files.
  - [`prettier-plugin-packagejson`](https://github.com/matzkoh/prettier-plugin-packagejson) → Formats `package.json` files.
  - [`prettier-plugin-properties`](https://github.com/eemeli/prettier-plugin-properties) → Formats `.properties` files.
  - [`prettier-plugin-prisma`](https://github.com/omar-dulaimi/prettier-plugin-prisma) → Formats Prisma schema files.
  - [`prettier-plugin-astro`](https://github.com/withastro/prettier-plugin-astro) → Formats `.astro` files.
  - [`@prettier/plugin-xml`](https://github.com/prettier/plugin-xml) → Formats `.xml` files.
  - [`prettier-plugin-tailwindcss`](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) → Formats `.css` files.

- **Base Style Rules**
  - Trailing commas: `es5`
  - Tab width: `2`
  - Semicolons: `true`
  - Single quotes: `true`
  - Print width: `80`
  - End of line: `lf`

- **File-specific Overrides**
  - **TOML (`.toml`)** → Uses wider `printWidth` of 100 characters.

---

## Installation

```bash
npm install -g prettier
npm install -D prettier prettier-config-spellbookx
```

or

```bash
pnpm add -g prettier
pnpm add -D prettier prettier-config-spellbookx prettier-plugin-astro prettier-plugin-sh prettier-plugin-toml prettier-plugin-ini prettier-plugin-packagejson prettier-plugin-properties prettier-plugin-prisma @prettier/plugin-xml prettier-plugin-tailwindcss
```

Unluckly with pnpm you have to manually install all prettier dependencies.

or

```bash
yarn global add prettier
yarn add -D prettier prettier-config-spellbookx
```

or

```bash
bun add -g prettier
bun add -D prettier prettier-config-spellbookx
```

---

## Usage

Create a `.prettierrc.mjs` file at your project root:

```js
import spellbookx from "prettier-config-spellbookx";

/**
 * @type {import("prettier").Config}
 */
const config = {
  ...spellbookx.configs.base,
};

export default config;
```

### Editor integration

Most editors (VSCode, JetBrains, etc.) detect Prettier automatically if the plugin is installed.
For VSCode, ensure the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) is installed and enable **Format on Save**:

```jsonc
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
}
```

---

## Resources

- [Prettier Documentation](https://prettier.io/docs/en/configuration.html)
- [Prettier Options](https://prettier.io/docs/en/options.html)

---

## License

This project is licensed under the MIT License.

**Copyright (c) 2025 Davide Di Criscito**

For the full details, see the [LICENSE](LICENSE) file.
