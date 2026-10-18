import { describe, expect, it } from 'vitest';
import { feedHtml } from './feed-html';

const base = 'https://timmday.com';

describe('feedHtml', () => {
  it('strips scripts and styles', () => {
    const out = feedHtml(
      '<p>Hi</p><script>alert(1)</script><style>p{}</style>',
      base,
    );
    expect(out).toBe('<p>Hi</p>');
  });

  it('makes image and link URLs absolute', () => {
    const out = feedHtml(
      '<img src="/_astro/chart.webp" alt="Chart" /><a href="/posts/x/">x</a>',
      base,
    );
    expect(out).toContain('src="https://timmday.com/_astro/chart.webp"');
    expect(out).toContain('href="https://timmday.com/posts/x/"');
  });

  it('leaves external links alone', () => {
    expect(feedHtml('<a href="https://example.com/">e</a>', base)).toContain(
      'href="https://example.com/"',
    );
  });

  it('keeps details and summary so asides survive', () => {
    expect(
      feedHtml('<details><summary>More</summary><p>Body</p></details>', base),
    ).toContain('<summary>More</summary>');
  });
});
