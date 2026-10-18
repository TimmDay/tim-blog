import { getCollection, type CollectionEntry } from 'astro:content';
import { byNewest, isVisible, showDrafts } from './drafts';

export type Post = CollectionEntry<'posts'>;

/** Every Post the current build should publish, newest first. */
export async function getVisiblePosts(): Promise<Post[]> {
  const drafts = showDrafts(process.env);
  const posts = await getCollection('posts', (post) => isVisible(post, drafts));
  return posts.sort(byNewest);
}

export function postUrl(post: Post): string {
  return `/posts/${post.id}/`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
