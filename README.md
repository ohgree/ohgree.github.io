# [ohgree.github.io](https://ohgree.github.io)

[![Check](https://github.com/ohgree/ohgree.github.io/actions/workflows/check.yml/badge.svg)](https://github.com/ohgree/ohgree.github.io/actions/workflows/check.yml)
[![Deploy](https://github.com/ohgree/ohgree.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/ohgree/ohgree.github.io/actions/workflows/deploy.yml)

An index of the packages, apps, and services I build and maintain.

Stack: React 19, Vite, TypeScript, Tailwind CSS 4 (daisyUI token layer), oxlint + oxfmt.

## Adding a project

Everything on the page comes from [`data/projects.source.json`](./data/projects.source.json). Add
an entry and the rest — stars, language, license, npm version, weekly downloads, last-pushed date
— is filled in at build time:

```jsonc
{
  "slug": "my-thing",
  "name": "my-thing",
  "kind": "package", // package | app | service | tool
  "repo": "my-thing", // repo name under the owner, or omit
  "npm": "my-thing", // npm package name, or omit
  "tagline": "One line on what it is.",
  "blurb": "A couple of sentences on why it exists.",
  "links": [{ "label": "Live demo", "url": "https://…" }],
}
```

Sections appear in `package → app → service → tool` order, and empty ones are skipped.

## How the data works

`scripts/fetch-projects.mjs` merges the curated list above with the GitHub and npm registry APIs
and writes `src/data/projects.json`. That file is committed, which serves two purposes:

- `pnpm dev` and PR builds work offline and never depend on API availability
- if a request fails during a deploy, the previous value is reused and the build still succeeds

The deploy workflow re-runs the fetch on every push to `main` and on a daily cron, so versions and
star counts stay current without a commit. Visitors hit static files only — no client-side API
calls, no rate limits.

Set `GITHUB_TOKEN` locally to avoid the 60 req/hr unauthenticated limit (CI passes it in already).

## Development

```sh
pnpm install
pnpm dev          # dev server
pnpm data         # refresh src/data/projects.json from the live APIs
pnpm build        # typecheck + production build
pnpm lint         # oxlint
pnpm fmt          # oxfmt (use fmt:check in CI)
```

## Interaction

Cards start collapsed, showing name, tagline, and stats; clicking one expands the blurb and the
links. The whole summary is the toggle button, which is why the title is not itself a link — the
repo link lives in the expanded row instead of nesting an anchor inside a button.

The wide header hands off to a compact bar as you scroll, driven by
[Motion](https://motion.dev) MotionValues so the transform updates per frame without re-rendering
React. Two things are load-bearing there:

- The bar is `fixed`, not a shrinking `sticky` header. Animating a sticky header's height reflows
  the page, which moves `scrollY`, which can re-cross the fold threshold — the fold then stutters
  mid-scroll. Fixed keeps document height constant, so only transform and opacity move.
- `m` (Motion's small build) carries no features of its own, so `LazyMotion` in `main.tsx` supplies
  `domAnimation`. Without it, MotionValue styles silently never bind and the bar stays hidden.

## Theming

The palette is a daisyUI theme pair, set in one place in [`src/styles.css`](./src/styles.css):

```css
@plugin "daisyui" {
  themes:
    silk --default,
    coffee --prefersdark;
}
```

Swap either name for any [built-in daisyUI theme](https://daisyui.com/docs/themes/) to re-skin the
page. Components are hand-styled against the token layer (`base-*`, `primary`, `*-content`), so
they follow whatever theme is set.

The page sits on `base-200` so cards can be the lightest surface (`base-100`) and read as raised.
Worth knowing when changing themes: how far apart the base steps sit varies a lot — `base-300` is
15.6 lightness units below `base-100` in `autumn`, which reads as a grey slab rather than that
theme's own look, where `base-200` is a comfortable 8.1 in `silk`.

## License

[MIT](./LICENSE)
