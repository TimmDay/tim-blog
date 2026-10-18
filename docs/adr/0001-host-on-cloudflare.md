# Host on Cloudflare, not Vercel

The site is a static Astro build, so any static host works. We chose Cloudflare over Vercel (already connected to this account) because it is meant to be the long-term home for the whole portfolio, not just this blog: the free tier has unlimited static bandwidth, and Workers, R2 and D1 are there when a later project needs a backend or storage. Nothing in the repo depends on Cloudflare beyond the deploy target, so the build output (`dist/`) stays portable.

## Consequences

Cloudflare now offers two ways to serve a static site: Pages, and Workers with static assets. Cloudflare is putting its investment into Workers. Either works for this site; pick per [the compatibility matrix](https://developers.cloudflare.com/workers/static-assets/compatibility-matrix/) when setting up the project.
