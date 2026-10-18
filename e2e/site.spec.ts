import { expect, test } from '@playwright/test';

test('flashcard Widget flips and moves between cards', async ({ page }) => {
  await page.goto('/posts/widgets-demo/');
  const deck = page.getByRole('region', { name: 'Lorem flashcards' });
  await deck.scrollIntoViewIfNeeded();
  // The deck is server-rendered; wait until its island has hydrated before clicking.
  await expect(page.locator('astro-island:not([ssr])')).toHaveCount(1);

  await deck.getByRole('button', { name: 'Show answer' }).click();
  await expect(deck).toContainText('Sit amet, consectetur adipiscing elit.');

  await deck.getByRole('button', { name: 'Next' }).click();
  await expect(deck).toContainText('Card 2 of 3');
  await expect(deck).toContainText('Sed do eiusmod?');
});

test('Widgets show their Fallback without JS', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/posts/widgets-demo/');
  await expect(page.locator('dl')).toContainText(
    'Tempor incididunt ut labore.',
  );
  await expect(page.getByRole('button', { name: 'Show answer' })).toBeHidden();
  await context.close();
});

test('each CV Variant downloads as a PDF', async ({ page, request }) => {
  await page.goto('/contact/');
  const links = page.getByRole('link', { name: /CV/ });
  await expect(links).toHaveCount(2);
  for (const href of await links.evaluateAll((els) =>
    els.map((el) => el.getAttribute('href')),
  )) {
    const response = await request.get(href!);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/pdf');
  }
});

test('every page has a link preview image and a canonical URL', async ({
  page,
}) => {
  await page.goto('/posts/widgets-demo/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://timmday.com/og/widgets-demo.png',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://timmday.com/posts/widgets-demo/',
  );
});
