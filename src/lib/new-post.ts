// Pure helpers for scripts/new-post.ts, kept here so Vitest can test them.

/** "Why AI Won't Replace EMs!" -> "why-ai-wont-replace-ems" */
export function slugify(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** YYYY-MM-DD in the local timezone, not UTC, so a Post started at 9am Melbourne time gets today's date. */
export function localDate(now: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** The starting index.mdx for a new draft Post. */
export function postTemplate(title: string, date: string): string {
  return `---
title: ${JSON.stringify(title)}
summary: ''
date: ${date}
tags: []
draft: true
---

Lorem ipsum.
`;
}
