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

const fontDir = join(process.cwd(), 'node_modules/@fontsource/open-sans/files');
const logo = `data:image/svg+xml;base64,${Buffer.from(
  await readFile(join(process.cwd(), 'public/favicon.svg')),
).toString('base64')}`;

// Colours mirror the light theme in src/styles/tokens.css.
const color = {
  bg: '#f9fafc',
  surface: '#ffffff',
  text: '#65738c',
  heading: '#3e465b',
  accent: '#3498db',
  border: '#e0e6ed',
};

const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
) => ({
  type,
  props: { style, children },
});

export const GET: APIRoute = async ({ props }) => {
  const { title, subtitle } = props as { title: string; subtitle: string };
  const [regular, bold] = await Promise.all([
    readFile(join(fontDir, 'open-sans-latin-400-normal.woff')),
    readFile(join(fontDir, 'open-sans-latin-700-normal.woff')),
  ]);

  const svg = await satori(
    el(
      'div',
      {
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: '48px',
        background: color.bg,
        fontFamily: 'Open Sans',
      },
      el(
        'div',
        {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          background: color.surface,
          border: `1px solid ${color.border}`,
          borderBottom: `8px solid ${color.accent}`,
        },
        [
          el('div', { display: 'flex', alignItems: 'center', gap: '16px' }, [
            { type: 'img', props: { src: logo, width: 56, height: 56 } },
            el(
              'div',
              { fontSize: 32, fontWeight: 700, color: color.heading },
              site.wordmark,
            ),
          ]),
          el(
            'div',
            {
              fontSize: 60,
              fontWeight: 700,
              lineHeight: 1.2,
              color: color.heading,
            },
            title,
          ),
          el('div', { fontSize: 28, color: color.text }, subtitle),
        ],
      ),
    ) as Parameters<typeof satori>[0],
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Open Sans', data: regular, weight: 400, style: 'normal' },
        { name: 'Open Sans', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
