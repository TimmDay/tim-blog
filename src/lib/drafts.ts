/**
 * Draft Posts are built only when SHOW_DRAFTS=true, which is set in CI and on
 * preview deploys, never in production.
 */
export function showDrafts(env: Record<string, string | undefined>): boolean {
  return env.SHOW_DRAFTS === 'true';
}

export function isVisible(
  post: { data: { draft: boolean } },
  drafts: boolean,
): boolean {
  return drafts || !post.data.draft;
}

export function byNewest<T extends { data: { date: Date } }>(
  a: T,
  b: T,
): number {
  return b.data.date.getTime() - a.data.date.getTime();
}
