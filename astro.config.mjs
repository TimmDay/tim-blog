// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import { unified } from '@astrojs/markdown-remark';
import remarkBreaks from 'remark-breaks';
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
  markdown: {
    // remarkBreaks: a single newline in a Post is a line break on the page.
    processor: unified({ remarkPlugins: [remarkRequireAlt, remarkBreaks] }),
  },
});
