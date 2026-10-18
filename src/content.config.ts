import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  // One folder per Post: src/content/posts/<slug>/index.mdx, with its images alongside.
  loader: glob({
    pattern: '*/index.mdx',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string(),
    /** Used in lists, RSS, llms.txt and link previews. */
    summary: z.string().max(200),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** Set when the Post was first published elsewhere. */
    canonicalUrl: z.url().optional(),
  }),
});

export const collections = { posts };
