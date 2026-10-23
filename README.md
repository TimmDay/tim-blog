# tim-blog

Source for [timmday.com](https://timmday.com), Tim Day's blog on AI progress, software engineering and leading teams through the transition.

Built with Astro, MDX and Svelte. Hosted on Cloudflare.

## Develop

```sh
pnpm install
pnpm dev          # local server
pnpm new-post "Title"   # start a draft Post
pnpm check        # lint + typecheck
pnpm test:run     # unit tests
pnpm build        # static site in dist/
```

In VS Code, accept the recommended extensions (Prettier and MDX) and Posts format on save.

## Docs

- [GLOSSARY.md](GLOSSARY.md): the words this project uses
- [docs/adr/](docs/adr/): decisions and why
