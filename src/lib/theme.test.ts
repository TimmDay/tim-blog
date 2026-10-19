import { describe, expect, it } from 'vitest';
import { nextTheme, readSavedTheme, saveTheme } from './theme';

describe('readSavedTheme', () => {
  it('returns a saved light or dark theme', () => {
    expect(readSavedTheme({ getItem: () => 'dark' })).toBe('dark');
    expect(readSavedTheme({ getItem: () => 'light' })).toBe('light');
  });

  it('ignores missing or unexpected values', () => {
    expect(readSavedTheme({ getItem: () => null })).toBeNull();
    expect(readSavedTheme({ getItem: () => 'purple' })).toBeNull();
  });

  it('survives storage that throws', () => {
    const throwing = {
      getItem: () => {
        throw new Error('blocked');
      },
    };
    expect(readSavedTheme(throwing)).toBeNull();
  });
});

describe('saveTheme', () => {
  it('does not throw when storage is blocked', () => {
    const throwing = {
      setItem: () => {
        throw new Error('blocked');
      },
    };
    expect(() => saveTheme(throwing, 'dark')).not.toThrow();
  });
});

describe('nextTheme', () => {
  it('flips between light and dark', () => {
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('light');
  });
});
