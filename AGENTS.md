# tim-blog

Tim Day's blog at timmday.com. Read [GLOSSARY.md](GLOSSARY.md) for the project's words (Post, Widget, Fallback, Tag, CV Variant) and [docs/adr/](docs/adr/) for decisions.

## Conventions

- Tone: to the point and useful. No filler copy. Use lorem ipsum for placeholders; Tim writes all real copy.
- A Post is `src/content/posts/<slug>/index.mdx` with its images beside it. Start one with `pnpm new-post "Title"`; it begins as a draft. `widgets-demo/` shows images and Widgets.
- A published Post must have a summary; the build fails otherwise.
- A single newline in a Post is a line break on the page (remark-breaks). Inside a component like `<Aside>`, leave a blank line after the opening tag and before the closing one, or Prettier joins the lines.
- Every interactive Widget is wrapped in `src/widgets/WidgetFrame.astro` and has a Fallback (ADR 0002). Hydrate with `client:visible`, never `client:only`.
- Images in Markdown must have alt text; the build fails otherwise.
- Drafts (`draft: true`) are built only when `SHOW_DRAFTS=true` (CI and preview deploys).
- Lighthouse bar: performance 95+, accessibility 100. CI enforces both, plus axe in light, dark and mobile.

## Design system

- Tokens (colour, type, spacing, shape) live in `src/styles/tokens.css`. Use a token for every colour, font size and space; never a raw value.
- The design draws inspiration from lethain.com and andykelk.net, and is Tim's own to evolve. Current choices: system fonts only (no font downloads), a white page, near-black sans UI text, and a grey serif `.prose` column for reading.
- Shared UI components live in `src/components/ui/` (Button, ArrowLink, Logo).
- `Base` takes a `width` prop: `prose` for reading pages, `page` for lists, `wide` for a Post and its sidebar.
- `/styleguide/` renders every token and component. It is `noindex` and left out of the sitemap.
- Every colour token is `light-dark(light, dark)`. The OS decides by default; the header toggle sets `data-theme` on `<html>` and saves it in localStorage.
- `--color-accent` is decorative only (rules, bars). Text in the link colour must use `--color-link`, which passes WCAG AA.
- Links in running text are underlined. Standalone links (nav, titles, ArrowLink) are not.

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
