# AGENTS.md

## Project commands

- Package manager: `pnpm` (see the `packageManager` field in `package.json`).
- Install dependencies with `pnpm install --frozen-lockfile`.
- Build with `pnpm build`. This runs `astro check` before `astro build`.
- Lint with `pnpm lint`.
- Preview a production build with `pnpm preview`.

## Dependabot pull requests

Before reviewing or merging a Dependabot pull request in this repository, read and follow `docs/maintenance/dependabot.md`.

In particular:

- Do not merge major version updates automatically.
- Do not merge if the build fails, any required check is not green, the pull request has conflicts, or the changed files go beyond the dependency files allowed by the runbook.
- For this site, run the three-page smoke check listed in the runbook before merging an eligible Dependabot pull request.
