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

/** The starting index.md for a new draft Post, with an optional body. */
export function postTemplate(
  title: string,
  date: string,
  body = 'Lorem ipsum.',
): string {
  return `---
title: ${JSON.stringify(title)}
summary: ''
date: ${date}
tags: []
draft: true
---

${body.trim()}
`;
}

const imageFile = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

export type ConvertedNote = {
  body: string;
  /** Image files the note embeds; they need copying into the Post's folder. */
  images: string[];
  /** Embedded notes, which can't come across; they become plain text. */
  notes: string[];
};

/**
 * Turns an Obsidian note into Post Markdown: drops its frontmatter and
 * %%comments%%, turns [[links]] into plain text, and image embeds into
 * Markdown images with empty alt text (the build then asks for alt text).
 */
export function convertObsidianNote(note: string): ConvertedNote {
  const images: string[] = [];
  const notes: string[] = [];
  const body = note
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    .replace(/%%[\s\S]*?%%/g, '')
    .replace(/!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g, (_, target: string) => {
      const name = target.trim();
      if (imageFile.test(name)) {
        images.push(name);
        return `![](<./${name}>)`;
      }
      notes.push(name);
      return name;
    })
    .replace(
      /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g,
      (_, target: string, alias?: string) => (alias ?? target).trim(),
    );
  return { body, images, notes };
}
