# Changesets

Hello and welcome! This folder holds the changeset files for Spellbookx.

Run `pnpm changeset` to declare changes interactively, or `pnpm changeset:commits` on a feature branch to generate changesets from its Conventional Commits (it reads the commits since `main`, so on `main` it finds none). Commit the changesets with the rest of the change.

To release, run `pnpm release` on an up-to-date, clean `main`. `dropdx` checks the working tree, runs `changeset version` on the committed changesets, builds, commits `chore(release): bump to vX.Y.Z`, tags, pushes and publishes. Do not run `pnpm changeset:version` yourself before `pnpm release`: `dropdx` would find no changesets and add an automatic patch bump.
