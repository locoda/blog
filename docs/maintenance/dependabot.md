# Dependabot review and merge runbook

This document defines how Dependabot pull requests are reviewed and merged in this repository. The goal is to keep routine dependency maintenance low-noise without letting an update merge before it has passed the same checks a maintainer would run manually.

## Current Dependabot setup

Dependabot is configured in `.github/dependabot.yml`:

- Ecosystem: npm, using the manifests in the repository root.
- Schedule: monthly.
- Routine minor and patch version updates are grouped into one pull request.
- Security updates are grouped separately.
- Major version updates are not grouped with minor and patch updates.

Security updates are triggered by advisories rather than by the monthly version-update schedule. Lowering the routine update frequency does not delay a security fix.

## Pull requests that may be merged automatically

A Dependabot pull request may be merged by the reviewing agent only when all of the following are true:

1. The author is `dependabot[bot]`.
2. The update is one of:
   - the grouped minor-and-patch version update;
   - a grouped security update whose constituent updates are minor or patch updates;
   - a GitHub Actions grouped update, if a `github-actions` entry is added later.
3. The changed files are limited to dependency files for the ecosystem being updated. For the current npm setup, that means `package.json` and `pnpm-lock.yaml`. A pull request that changes source code, content, workflows, or configuration outside the dependency update must not be merged automatically.
4. The pull request is mergeable and has no conflicts.
5. The build and smoke checks below pass.

Major version updates are never merged automatically. Leave them open and report them for manual review.

## Required checks

Because this repository does not currently define a GitHub Actions build workflow, the reviewing agent must run the checks locally against the pull request head before merging.

From a clean checkout of the pull request branch:

```sh
pnpm install --frozen-lockfile
pnpm build
```

`pnpm build` runs `astro check` and then `astro build`. Both must succeed.

If GitHub status checks are present on the pull request, they must also be complete and successful. A pending, failing, cancelled, or missing-but-expected check blocks an automatic merge.

## Three-page smoke check

After the build succeeds, start the production preview:

```sh
pnpm preview
```

Check these three representative pages:

1. `/` — the home page and post list.
2. `/archive/` — the archive/index view over the post collection.
3. `/posts/book-invisible-cities/` — a representative post detail page.

For each page, confirm:

- the page loads successfully and is not a 404;
- the page title is present;
- the main content renders;
- there is no obvious application error or broken layout.

If the preview cannot be started, or any smoke page fails, do not merge. Report the failing page instead.

When the site structure changes, update this list so the three pages remain representative: one home/list page, one collection/index page, and one detail page.

## Merge procedure

When every gate above passes:

1. Merge the pull request using the repository's normal merge method.
2. Delete the Dependabot head branch if GitHub does not delete it automatically.
3. Record the result for the maintainer: repository, pull request number and URL, update type, build result, and the three smoke pages checked.

Do not force-merge, bypass failing checks, or edit a Dependabot pull request's dependency changes to make it pass. If the update needs code changes, stop and hand it back for manual work.

## When to stop and report instead

Stop and report, without merging, when any of these occur:

- the pull request contains a major version update;
- the build fails or a required status check is not successful;
- the pull request has merge conflicts;
- files outside the allowed dependency files changed;
- the three-page smoke check fails;
- the update requires source, content, workflow, or configuration changes beyond the dependency manifests and lockfile.

The report should include the pull request link, the failing gate, and the shortest useful evidence, such as the failing command, check name, or smoke page.
