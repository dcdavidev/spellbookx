# 2. Adopt Changesets for Monorepo Versioning and Publishing

Date: 2026-10-21

## Status

Accepted

## Context

Publishing multiple packages from a monorepo requires coordinated version bumps, automated changelog generation, and safe execution of registry publishing.

Previously, the project evaluated single-script workflows and `release-it`. However, single-package release tools lack native, robust primitives for handling multi-package dependency trees, intent-based versioning, and synchronized lockstep releases in a monorepo.

## Decision

We adopted **Changesets** (`@changesets/cli`) combined with **Turborepo** for versioning and publishing:

1. **Native Monorepo Support**: Changesets is specifically designed from the ground up for monorepos, allowing contributors to declare release intents per pull request or commit.
2. **Synchronized Lockstep Releases**: Configured via the `fixed` group in `.changeset/config.json`, keeping all workspace packages aligned on identical version numbers.
3. **Conventional Commits Integration**: `changeset-conventional-commits` bridges Conventional Commit history into changelogs and version bumps.
4. **Turborepo-Orchestrated Publishing**: Each package exposes an independent `"release": "pnpm publish --access public --no-git-checks"` script, and the root triggers `turbo run release` which automatically builds packages prior to publishing.

## Consequences

### Positive

- Native, battle-tested monorepo release workflow.
- Clear separation between version intent capture (`changeset`), version application (`changeset version`), and artifact deployment (`turbo run release`).
- Clean, automated GitHub releases and package changelogs.
- Replaced custom shell/Node scripts with standard tooling.

### Negative or Trade-offs

- Release process requires a two-step sequence (`pnpm run version` followed by `pnpm run release`).

## Update (2026-11)

Publishing moved from `turbo run release` (one `pnpm publish` per package) to [`dropdx`](https://github.com/dcdavidev/dropdx), which builds, tags and publishes the packages in topological order. The per-package `release` scripts and the Turborepo `release` task were removed. The root scripts now are:

- `changeset:commits`: create changesets from Conventional Commits.
- `changeset:version`: apply the changesets (`changeset version`).
- `release:publish`: publish with `dropdx`.
- `release`: run the three steps above in sequence.

The previous `version` and `publish` scripts were renamed because they shadowed the `pnpm version` and `pnpm publish` built-in commands (see [`docs/npm-scripts.md`](../npm-scripts.md)).
