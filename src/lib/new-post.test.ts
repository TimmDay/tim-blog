import { describe, expect, it } from 'vitest';
import { localDate, postTemplate, slugify } from './new-post';

describe('slugify', () => {
  it('makes a lowercase, hyphenated slug', () => {
    expect(slugify("Why AI Won't Replace EMs!")).toBe(
      'why-ai-wont-replace-ems',
    );
  });

  it('drops accents and trims stray hyphens', () => {
    expect(slugify('  Café: déjà vu?  ')).toBe('cafe-deja-vu');
  });
});

describe('localDate', () => {
  it('uses the local calendar day', () => {
    expect(localDate(new Date(2026, 0, 5, 9, 30))).toBe('2026-01-05');
  });
});

describe('postTemplate', () => {
  it('starts as a draft and quotes the title safely', () => {
    const mdx = postTemplate('AI: the "real" cost', '2026-10-21');
    expect(mdx).toContain('title: "AI: the \\"real\\" cost"');
    expect(mdx).toContain('draft: true');
    expect(mdx).toContain('date: 2026-10-21');
  });
});
