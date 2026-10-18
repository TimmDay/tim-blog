import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [
  '/',
  '/posts/',
  '/posts/widgets-demo/',
  '/about/',
  '/contact/',
  '/styleguide/',
  '/404.html',
];

for (const path of pages) {
  test(`${path} has no axe violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22aa',
        'best-practice',
      ])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test('the demo Post still has no violations with the aside open and a card flipped', async ({
  page,
}) => {
  await page.goto('/posts/widgets-demo/');
  await page.getByText('Lorem aside: why this matters').click();
  await page.getByRole('button', { name: 'Show answer' }).click();
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
