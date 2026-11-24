# 🤖 Spellbookx Agent Skills

Official AI agent skills for the **Spellbookx** developer toolchain conforming to the open [Agent Skills specification](https://github.com/vercel-labs/skills).

These skills provide AI coding assistants (including **Google Antigravity**, **Cursor**, **Claude Code**, **GitHub Copilot**, **Cline**, **Windsurf**, **Zed**, and **Warp**) with contextual knowledge and deterministic workflows to scaffold, configure, and maintain the Spellbookx developer ecosystem.

---

## Available Skills

| Skill                              | Description                                                                                                                                   | Location                                                                                         |
| :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| **`spellbookx-setup`**             | Complete guided setup of the full Spellbookx suite (ESLint, Prettier, CSpell, Commitlint, czg, Lefthook) into any JS/TS codebase or monorepo. | [`skills/spellbookx-setup/SKILL.md`](./skills/spellbookx-setup/SKILL.md)                         |
| **`spellbookx-eslint-plugin`**     | Composes ESLint 9+ flat configs across 16 presets, framework integrations (React, Astro, Svelte, Node), and custom import sorting recipes.    | [`skills/spellbookx-eslint-plugin/SKILL.md`](./skills/spellbookx-eslint-plugin/SKILL.md)         |
| **`spellbookx-prettier-config`**   | Configures Prettier presets (Tailwind, Astro, Svelte, Prisma, SQL, Nginx) and multi-plugin composition via `defineSbxConfig`.                 | [`skills/spellbookx-prettier-config/SKILL.md`](./skills/spellbookx-prettier-config/SKILL.md)     |
| **`spellbookx-cspell-config`**     | Configures code spell-checking, technical vocabularies, multi-language dictionaries (EN, IT, ES, FR, DE), and ignore globs.                   | [`skills/spellbookx-cspell-config/SKILL.md`](./skills/spellbookx-cspell-config/SKILL.md)         |
| **`spellbookx-commitlint-config`** | Enforces Conventional Commits with automatic monorepo package scope discovery, the commit-msg hook, and the CI check.                         | [`skills/spellbookx-commitlint-config/SKILL.md`](./skills/spellbookx-commitlint-config/SKILL.md) |
| **`spellbookx-cz-config`**         | Sets up the interactive `czg` commit prompt, with emoji and AI options and monorepo scopes.                                                   | [`skills/spellbookx-cz-config/SKILL.md`](./skills/spellbookx-cz-config/SKILL.md)                 |

---

## Installation

### Option 1: Via the `skills` CLI (Recommended)

Install skills directly into your project repository using the `skills` CLI:

```bash
# Install all Spellbookx skills into the current project
npx skills add dcdavidev/spellbookx

# Or install a specific skill:
npx skills add dcdavidev/spellbookx --skill spellbookx-setup
npx skills add dcdavidev/spellbookx --skill spellbookx-eslint-plugin
npx skills add dcdavidev/spellbookx --skill spellbookx-prettier-config
npx skills add dcdavidev/spellbookx --skill spellbookx-cspell-config
npx skills add dcdavidev/spellbookx --skill spellbookx-commitlint-config
npx skills add dcdavidev/spellbookx --skill spellbookx-cz-config
```

#### Global Installation (Available across all your projects)

To make these skills available globally to your AI assistant across every repository on your machine:

```bash
npx skills add -g dcdavidev/spellbookx
```

---

### Option 2: Manual Installation

You can copy the `.agents/skills` folder directly into any project:

```bash
# In your target project root:
mkdir -p .agents/skills
git clone --depth 1 https://github.com/dcdavidev/spellbookx.git /tmp/spellbookx
cp -r /tmp/spellbookx/.agents/skills/* .agents/skills/
rm -rf /tmp/spellbookx
```

---

## Supported AI Assistants

Skills in `.agents/skills` are automatically recognized and loaded by:

- **Google Antigravity** (CLI `agy` & Antigravity IDE)
- **Cursor** (`.agents/skills` or `.cursor/skills`)
- **Claude Code** (`.agents/skills`)
- **GitHub Copilot Workspace & Chat**
- **Cline** / **Roo Code**
- **Windsurf** / **Cascade**
- **Zed** & **Warp**

---

## Usage Examples

Once installed, prompt your AI assistant naturally:

- _"Set up the Spellbookx developer toolchain in this repository using `spellbookx-setup`."_
- _"Configure ESLint flat config with Next.js and Tailwind import sorting using `spellbookx-eslint-plugin`."_
- _"Add Svelte and Prisma Prettier formatting with Tailwind sorting using `spellbookx-prettier-config`."_
- _"Configure CSpell with technical dictionaries and custom ignore paths using `spellbookx-cspell-config`."_
- _"Set up Conventional Commits with automatic monorepo scope detection using `spellbookx-commitlint-config`."_
- _"Turn on emoji in the interactive commit prompt using `spellbookx-cz-config`."_
