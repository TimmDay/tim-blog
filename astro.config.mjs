// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import { unified } from '@astrojs/markdown-remark';
import { remarkRequireAlt } from './src/lib/remark-require-alt.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://timmday.com',
  trailingSlash: 'always',
  image: { layout: 'constrained' },
  integrations: [
    mdx(),
    svelte(),
    sitemap({ filter: (page) => !page.endsWith('/styleguide/') }),
  ],
  fonts: [
    {
      // Self-hosted from the installed @fontsource package; no third-party requests.
      provider: fontProviders.local(),
      name: 'Open Sans',
      cssVariable: '--font-open-sans',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: [
              '@fontsource/open-sans/files/open-sans-latin-400-normal.woff2',
            ],
            weight: 400,
            style: 'normal',
          },
          {
            src: [
              '@fontsource/open-sans/files/open-sans-latin-700-normal.woff2',
            ],
            weight: 700,
            style: 'normal',
          },
        ],
      },
    },
  ],
  markdown: {
    processor: unified({ remarkPlugins: [remarkRequireAlt] }),
  },
});
