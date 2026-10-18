// @ts-check
import { defineConfig } from 'astro/config';
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
  integrations: [mdx(), svelte(), sitemap()],
  markdown: {
    processor: unified({ remarkPlugins: [remarkRequireAlt] }),
  },
});
