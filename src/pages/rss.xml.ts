import rss from '@astrojs/rss';
import { getContainerRenderer as mdxRenderer } from '@astrojs/mdx/container-renderer';
import { getContainerRenderer as svelteRenderer } from '@astrojs/svelte/container-renderer';
import type { APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { render } from 'astro:content';
import { feedHtml } from '../lib/feed-html';
import { getVisiblePosts, postUrl } from '../lib/posts';
import { site } from '../lib/site';

// Full-text feed. Widgets render only their Fallback here (see ADR 0002).
export const GET: APIRoute = async () => {
  const container = await AstroContainer.create({
    renderers: await loadRenderers([mdxRenderer(), svelteRenderer()]),
  });
  const posts = await getVisiblePosts();

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const html = await container.renderToString(Content, {
        locals: { rss: true },
      });
      return {
        title: post.data.title,
        description: post.data.summary,
        pubDate: post.data.date,
        link: postUrl(post),
        categories: post.data.tags,
        content: feedHtml(html, site.url),
      };
    }),
  );

  return rss({
    title: site.author,
    description: site.description,
    site: site.url,
    items,
    customData: `<language>${site.locale}</language>`,
  });
};
