import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/tile.openstreetmap.org/**', (route) => route.abort());
});

test('Treffenroute akzeptiert nur vorhandene Sportfilter', async ({ page }) => {
  for (const [sport, count] of [
    ['Fußball', 1],
    ['Volleyball', 1],
    ['Basketball', 0],
    ['Badminton', 1],
    ['Unbekannt', 3],
  ] as const) {
    await page.goto(`/treffen?sport=${encodeURIComponent(sport)}`);
    await expect(page.getByRole('article')).toHaveCount(count);
    if (count === 1)
      await expect(page.getByRole('button', { name: sport, exact: true })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
  }
  await page.goto('/treffen?sport=Fu%C3%9Fball&sport=Volleyball&aktion=unbekannt');
  await expect(page.getByRole('article')).toHaveCount(3);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('Erstellen-Einstieg verwendet den bestehenden Demoablauf', async ({ page }) => {
  await page.goto('/treffen?aktion=erstellen');
  await expect(page.getByRole('dialog', { name: 'Mit wem möchtest du testen?' })).toBeVisible();
  await page.getByRole('button', { name: 'Lea', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Titel', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('article')).toHaveCount(3);
});
