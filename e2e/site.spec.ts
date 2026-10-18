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

test("the contact page is titled Let's talk and linked from the header", async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: "Let's talk" })
    .click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    "Let's talk",
  );
});

test('the style guide is kept out of search engines and the sitemap', async ({
  page,
  request,
}) => {
  await page.goto('/styleguide/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex',
  );
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  expect(sitemap).not.toContain('styleguide');
});

test.describe('theme toggle', () => {
  test.use({ colorScheme: 'light' });

  test('switches theme and remembers the choice', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: 'Switch to dark theme' });

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(
      page.getByRole('button', { name: 'Switch to light theme' }),
    ).toBeVisible();
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    expect(bg).toBe('rgb(15, 20, 28)');

    await page.goto('/about/');
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('is hidden without JS, where the OS setting applies', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('.theme-toggle')).toBeHidden();
    await context.close();
  });
});
