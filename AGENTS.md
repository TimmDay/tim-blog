# tim-blog

Tim Day's blog at timmday.com. Read [GLOSSARY.md](GLOSSARY.md) for the project's words (Post, Widget, Fallback, Tag, CV Variant) and [docs/adr/](docs/adr/) for decisions.

## Conventions

- Tone: to the point and useful. No filler copy. Use lorem ipsum for placeholders; Tim writes all real copy.
- A Post is `src/content/posts/<slug>/index.mdx` with its images beside it. Copy `widgets-demo/` to start one.
- Every interactive Widget is wrapped in `src/widgets/WidgetFrame.astro` and has a Fallback (ADR 0002). Hydrate with `client:visible`, never `client:only`.
- Images in Markdown must have alt text; the build fails otherwise.
- Drafts (`draft: true`) are built only when `SHOW_DRAFTS=true` (CI and preview deploys).
- Lighthouse bar: performance 95+, accessibility 100. CI enforces both, plus axe in light, dark and mobile.

## Commands

```sh
pnpm check                              # lint + astro check
pnpm test:run                           # unit tests (Vitest)
SHOW_DRAFTS=true pnpm build && pnpm test:e2e   # Playwright + axe against dist/
pnpm lighthouse                         # Lighthouse CI against dist/
```

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Astro documentation

Full documentation: https://docs.astro.build

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components (Svelte)](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling](https://docs.astro.build/en/guides/styling/)
