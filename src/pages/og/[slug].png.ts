import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { getVisiblePosts } from '../../lib/posts';
import { site } from '../../lib/site';

// Link preview images: one per Post, plus /og/default.png for every other page.
// Satori needs real font files, so these use the bundled Open Sans rather than the site's system fonts.

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
  bg: '#ffffff',
  text: '#555555',
  heading: '#1a1a1a',
  accent: '#357edd',
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
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 80px',
        background: color.bg,
        borderBottom: `12px solid ${color.accent}`,
        fontFamily: 'Open Sans',
      },
      [
        el('div', { display: 'flex', alignItems: 'center', gap: '16px' }, [
          { type: 'img', props: { src: logo, width: 56, height: 56 } },
          el(
            'div',
            { fontSize: 32, fontWeight: 400, color: color.heading },
            site.wordmark,
          ),
        ]),
        el(
          'div',
          {
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.15,
            color: color.heading,
          },
          title,
        ),
        el('div', { fontSize: 28, color: color.text }, subtitle),
      ],
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
