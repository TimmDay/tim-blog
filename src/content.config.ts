import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  // One folder per Post: src/content/posts/<slug>/index.md (or .mdx for Widgets), with its images alongside.
  loader: glob({
    pattern: '*/index.{md,mdx}',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z
    .object({
      title: z.string(),
      /** Used in lists, RSS, llms.txt and link previews. */
      summary: z.string().max(200),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      /** Set when the Post was first published elsewhere. */
      canonicalUrl: z.url().optional(),
    })
    .refine((post) => post.draft || post.summary.trim().length > 0, {
      message: 'A published Post needs a summary.',
      path: ['summary'],
    }),
});

export const collections = { posts };
