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
links, and clicking the blurb collapses it again. The summary is the toggle, which is why the title
is not itself a link — the repo link lives in the expanded row rather than nesting an anchor inside
a button.

The header animates between two states, expanded and compact, with no scroll-linked in-between
values: past a small threshold it compacts, back at the top it expands. Three things are
load-bearing:

- Everything common to both states (avatar, name, social links) is a **single instance** whose own
  size animates, so it travels between the layouts. Rendering an expanded copy and a compact copy
  and cross-fading them leaves that shared UI with no transition at all — it disappears in one place
  and reappears in another.
- The header is `sticky` with **natural content height** — nothing is declared or measured. Its
  paddings transition and the expanded-only block collapses, so the height animates as a
  consequence. A document shrink (the header compacting, a card collapsing) can clamp `scrollY`
  back across the compact threshold and re-expand the header on its own. The root's scroll floor
  (`min-h-[calc(100dvh+1rem)]`) keeps `maxScroll` above the threshold in every state, which makes
  the single-threshold state machine flap-free by construction — on any viewport, at any content
  length.
- `m` is [Motion](https://motion.dev)'s small build and carries no features of its own, so
  `LazyMotion` in `main.tsx` supplies `domAnimation`. Without it the animations silently never bind.

Gutters come from a single `--gutter`, shared by the header and the content via `CONTAINER` so the
compact bar's avatar stays aligned with the cards. Link labels drop to icon-only under `sm`, since
three labels beside the avatar and name squeeze the expanded row, and the expanded paddings tighten
below `30rem` so the header doesn't dominate a phone screen.

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
