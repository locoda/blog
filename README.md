# Blog (Astro Theme Typography Derivative)

A personal blog powered by **Astro 6** and based on the `astro-theme-typography` codebase.

- Live site: <https://blog.1mether.me/>
- Runtime: static site generation (SSG)
- Primary stack: Astro + TypeScript + UnoCSS + MD/MDX content collections

---

## 1) What this repository contains

This project is a content-first Astro blog with:

- Post listing and pagination.
- Individual post pages.
- Category pages.
- Archive and RSS feed.
- Optional comment providers (Disqus, Giscus, Twikoo).
- Optional analytics (Google Analytics, Umami).
- Optional KaTeX math rendering.
- A config layering model (`default config` + `user overrides`).

---

## 2) Tech stack and major dependencies

- **Astro** (`astro`) for pages and static build.
- **astro:content** collections for typed markdown/MDX content.
- **UnoCSS** for utility-first styling.
- **@astrojs/mdx** for MDX support.
- **@astrojs/sitemap** + `astro-robots-txt` for SEO plumbing.
- **astro-seo** for SEO metadata.
- **remark-math** + **rehype-katex** for math support.
- **@swup/astro** for page transitions.
- **dayjs**, **markdown-it**, **sanitize-html** for date/content utilities.

See `package.json` scripts and dependencies for exact versions and tooling.

---

## 3) Local development

### Prerequisites

- Node.js (current LTS recommended)
- pnpm (the repo is configured with `pnpm@10.13.1`)

### Install

```bash
pnpm install
```

### Run development server

```bash
pnpm dev
```

> `pnpm dev` runs `astro check` first, then starts Astro dev server.

### Build

```bash
pnpm build
```

### Preview production build

```bash
pnpm preview
```

### Lint

```bash
pnpm lint
```

Auto-fix lint issues:

```bash
pnpm lint:fix
```

---

## 4) Repository map (quick orientation)

```text
.
├── src/
│   ├── .config/              # default and user-overridden theme/site config
│   ├── components/           # reusable UI building blocks
│   │   ├── comments/         # Disqus/Giscus/Twikoo integrations
│   │   └── analytics/        # Google Analytics + Umami integrations
│   ├── content/
│   │   ├── posts/            # blog post markdown/mdx files
│   │   └── spec/             # non-post content pages (e.g. about)
│   ├── layouts/              # page layouts for list/post/default
│   ├── pages/                # Astro routes (home, post, category, archive, rss)
│   ├── styles/               # global css
│   ├── types/                # TypeScript interfaces/types
│   ├── utils/                # post/category/date helpers
│   ├── content.config.ts     # Astro content collections + schema
│   ├── i18n.ts               # translation dictionary
│   └── middleware.ts         # injects `translate()` into `Astro.locals`
├── scripts/                  # helper scripts for theme update/release/post creation
├── astro.config.ts           # Astro app configuration
├── uno.config.js             # UnoCSS setup
├── eslint.config.js          # lint rules
└── README.md
```

---

## 5) Configuration model (important)

Configuration is merged in two layers:

1. `src/.config/default.ts`: upstream/default values.
2. `src/.config/user.ts`: your local overrides.

The merge happens in `src/.config/index.ts` via `deepMerge()` and exported as `themeConfig`.

### Rule of thumb

- **Do not edit** `default.ts` for normal customization.
- Put customizations in `user.ts`.
- Keep overrides minimal: only define fields you actually change.

### High-impact config areas

Inside `ThemeConfig` (`src/types/themeConfig.ts`):

- `site`: title, subtitle, author, website, nav links, footer, page size, category mapping.
- `appearance`: theme mode, locale, color palette, fonts.
- `seo`: extra meta/link tags and twitter handle.
- `rss`: full text options and follow metadata.
- `comment`: provider-specific settings.
- `analytics`: IDs for GA / Umami.
- `latex`: KaTeX toggle.

---

## 6) Content authoring guide

Posts live in `src/content/posts/` and are validated by the schema in `src/content.config.ts`.

### Required frontmatter fields

- `title: string`
- `pubDate: date`
- `categories: string[]`

### Optional frontmatter fields

- `modDate: date`
- `draft: boolean` (default false)
- `description: string`
- `customData: string`
- `banner: image`
- `author: string`
- `commentsUrl: string`
- `source: { url: string, title: string }`
- `enclosure: { url: string, length: number, type: string }`
- `pin: boolean` (used on list ordering)

### Draft behavior

- In **production** builds, drafts are filtered out.
- In development, drafts remain visible.

### Ordering logic

- Post pages and normal lists sort by `modDate` (if present) or `pubDate` descending.
- Archive mode sorts by `pubDate` descending.
- Home pagination additionally prioritizes pinned posts.

---

## 7) Routing behavior

- `src/pages/[...page].astro`: paginated homepage/post list.
- `src/pages/posts/[...id].astro`: individual post pages.
- `src/pages/categories/index.astro`: category index.
- `src/pages/categories/[...category].astro`: category detail pages.
- `src/pages/archive.astro`: chronological archive.
- `src/pages/atom.xml.ts`: Atom/RSS feed endpoint.

Generated post URLs currently follow:

```text
/posts/<post-id>/
```

---

## 8) i18n model

- Locale dictionary lives in `src/i18n.ts` (`LANGUAGES`).
- `src/middleware.ts` injects `Astro.locals.translate(key, param?)`.
- The active locale is selected via `themeConfig.appearance.locale`.

When adding UI text:

1. Add the translation key for every supported locale.
2. Use `Astro.locals.translate(...)` in components/pages.

---

## 9) Comments and analytics

### Comments

`src/components/Comments.astro` selects the **first configured provider key** in `themeConfig.comment`:

- `disqus`
- `giscus`
- `twikoo`

Configure exactly one provider for predictable behavior.

### Analytics

Analytics IDs can come from either:

1. `themeConfig.analytics` values, or
2. public env vars:
   - `PUBLIC_GOOGLE_ANALYTICS_ID`
   - `PUBLIC_UMAMI_ANALYTICS_ID`

---

## 10) Math, markdown, and code blocks

- Markdown is configured in `astro.config.ts`.
- `remark-math` + `rehype-katex` enable KaTeX math rendering.
- Shiki syntax highlighting theme: `dracula`.
- Post pages attach a client-side copy button to `<pre><code>` blocks.

---

## 11) Built-in helper scripts

### Create a new post interactively

```bash
pnpm theme:create
```

Prompts for filename/title/extension/draft and creates a post template in `src/content/posts/`.

### Update from upstream template

```bash
pnpm theme:update
```

Adds/fetches `template` remote (`moeyua/astro-theme-typography`) and merges `template/main`.

### Release theme

```bash
pnpm theme:release
```

Uses `bumpp` and `changelogen` to version + changelog + tag.

---

## 12) AI contributor playbook (important for future agents)

If you are an AI agent working in this repo, follow this workflow:

1. **Read config before edits**
   - Inspect `src/.config/index.ts`, `src/.config/default.ts`, and `src/.config/user.ts` first.
2. **Respect content schema**
   - Validate post frontmatter against `src/content.config.ts`.
3. **Prefer extension over rewrite**
   - Add small utilities/components instead of replacing stable paths.
4. **Preserve URL and data contracts**
   - `getPostUrl()` and route patterns are relied upon by templates.
5. **Keep i18n complete**
   - New user-facing strings should be added in all locales.
6. **Run checks before handing off**
   - At least run `pnpm lint` and `pnpm build`.
7. **Avoid accidental behavioral changes**
   - Especially in sorting, draft filtering, and pagination logic.
8. **Document non-obvious changes**
   - If changing schema, route shape, or config merge behavior, update README and changelog notes.

---

## 13) Recommended change workflow (for humans and AI)

1. Create/update content or code.
2. Run lint and type/build checks:
   - `pnpm lint`
   - `pnpm build`
3. Start preview if needed:
   - `pnpm preview`
4. Confirm critical paths manually:
   - Home page pagination
   - Post detail rendering
   - Category pages
   - Atom feed generation
5. Commit with a clear message that states:
   - what changed,
   - why it changed,
   - any behavior/migration implications.

---

## 14) Common pitfalls

- Editing `default.ts` directly instead of using `user.ts`.
- Missing translation entries when adding strings.
- Invalid frontmatter types (schema will fail checks/build).
- Configuring multiple comment providers and expecting explicit priority control.
- Forgetting that drafts are hidden in production builds.

---

## 15) License

This repository includes a `LICENSE` file at project root. Keep license headers and upstream attributions intact when reusing or publishing derivative work.

