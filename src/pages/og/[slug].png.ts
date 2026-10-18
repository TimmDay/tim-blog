import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { getVisiblePosts } from '../../lib/posts';
import { site } from '../../lib/site';

// Link preview images: one per Post, plus /og/default.png for every other page.
// Placeholder styling until the design deep dive (issue #1).

export const getStaticPaths = (async () => {
  const posts = await getVisiblePosts();
  return [
    {
      params: { slug: 'default' },
      props: { title: site.author, subtitle: site.description },
    },
    ...posts.map((post) => ({
      params: { slug: post.id },
      props: { title: post.data.title, subtitle: site.author },
    })),
  ];
}) satisfies GetStaticPaths;

const fontDir = join(process.cwd(), 'node_modules/@fontsource/inter/files');

export const GET: APIRoute = async ({ props }) => {
  const { title, subtitle } = props as { title: string; subtitle: string };
  const [regular, bold] = await Promise.all([
    readFile(join(fontDir, 'inter-latin-400-normal.woff')),
    readFile(join(fontDir, 'inter-latin-700-normal.woff')),
  ]);

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: '#121212',
          color: '#e8e8e8',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { fontSize: 32, fontWeight: 700, color: '#93c5fd' },
              children: site.wordmark,
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: 64, fontWeight: 700, lineHeight: 1.15 },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: 30, color: '#a3a3a3' },
              children: subtitle,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: regular, weight: 400, style: 'normal' },
        { name: 'Inter', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
