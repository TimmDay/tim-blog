import { describe, expect, it } from 'vitest';
import { byNewest, isVisible, showDrafts } from './drafts';

describe('showDrafts', () => {
  it('is on only for the exact string "true"', () => {
    expect(showDrafts({ SHOW_DRAFTS: 'true' })).toBe(true);
    expect(showDrafts({ SHOW_DRAFTS: '1' })).toBe(false);
    expect(showDrafts({})).toBe(false);
  });
});

describe('isVisible', () => {
  const draft = { data: { draft: true } };
  const published = { data: { draft: false } };

  it('hides drafts unless drafts are shown', () => {
    expect(isVisible(draft, false)).toBe(false);
    expect(isVisible(draft, true)).toBe(true);
  });

  it('always shows published Posts', () => {
    expect(isVisible(published, false)).toBe(true);
  });
});

describe('byNewest', () => {
  it('sorts the most recent Post first', () => {
    const older = { data: { date: new Date('2026-01-01') } };
    const newer = { data: { date: new Date('2026-06-01') } };
    expect([older, newer].sort(byNewest)).toEqual([newer, older]);
  });
});
