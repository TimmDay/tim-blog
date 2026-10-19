export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** Reads a saved theme, ignoring anything unexpected. Storage can throw in private modes. */
export function readSavedTheme(
  storage: Pick<Storage, 'getItem'>,
): Theme | null {
  try {
    const value = storage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

export function saveTheme(
  storage: Pick<Storage, 'setItem'>,
  theme: Theme,
): void {
  try {
    storage.setItem(STORAGE_KEY, theme);
  } catch {
    // The choice just won't persist.
  }
}

export function nextTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark';
}

export function initThemeToggle(button: HTMLButtonElement): void {
  const root = document.documentElement;
  const osDark = window.matchMedia('(prefers-color-scheme: dark)');
  const current = (): Theme =>
    (root.dataset.theme as Theme | undefined) ??
    (osDark.matches ? 'dark' : 'light');

  const render = () => {
    const theme = current();
    button.dataset.current = theme;
    button.setAttribute('aria-label', `Switch to ${nextTheme(theme)} theme`);
  };

  button.addEventListener('click', () => {
    const theme = nextTheme(current());
    root.dataset.theme = theme;
    saveTheme(localStorage, theme);
    render();
  });
  osDark.addEventListener('change', render);

  render();
  button.hidden = false;
}
