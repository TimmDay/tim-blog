import type { APIRoute } from 'astro';
import { getVisiblePosts, postUrl } from '../lib/posts';
import { site } from '../lib/site';

// A plain-text map of the site for AI assistants: https://llmstxt.org
export const GET: APIRoute = async () => {
  const posts = await getVisiblePosts();
  const lines = [
    `# ${site.author}`,
    '',
    `> ${site.description}`,
    '',
    '## Posts',
    '',
    ...posts.map(
      (post) =>
        `- [${post.data.title}](${new URL(postUrl(post), site.url).href}): ${post.data.summary}`,
    ),
    '',
    '## About',
    '',
    `- [About](${site.url}/about/): background and experience`,
    `- [Contact](${site.url}/contact/): profiles and CV downloads`,
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
