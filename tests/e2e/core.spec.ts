import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.route('**/tile.openstreetmap.org/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(3);
});
test('DR-2.2.1/3: gemeinsame Filter und hilfreicher Leerzustand', async ({ page }) => {
  await page.getByRole('button', { name: 'Badminton', exact: true }).click();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.locator('.map-pin')).toHaveCount(1);
  await page.getByRole('button', { name: 'Fußball', exact: true }).click();
  await expect(page.getByRole('article')).toHaveCount(2);
  await expect(page.locator('.map-pin')).toHaveCount(2);
  await page.getByRole('searchbox').fill('nichtvorhanden');
  await expect(page.getByText('Keine Treffen gefunden', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Selbst ein Treffen erstellen' })).toBeVisible();
  await expect(page.locator('.map-pin')).toHaveCount(0);
});
test('DR-4.1/4.2: Gast, Demoauswahl, letzter Platz und Abmeldung', async ({ page }) => {
  await page.getByRole('button', { name: 'Badminton zu zweit', exact: true }).click();
  await page.getByRole('button', { name: 'Demo-Person wählen und mitmachen' }).click();
  await page.getByRole('button', { name: 'Lea', exact: true }).click();
  await page.getByRole('button', { name: 'Bin dabei', exact: true }).click();
  await expect(page.getByRole('dialog').getByText('2 von 2 dabei', { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog').getByText('Ausgebucht', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Teilnahme absagen', exact: true }).click();
  await expect(page.getByRole('dialog').getByText('1 von 2 dabei', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('DR-3.1/3.3: erstellen, Kartenpunkt und eigenes Treffen absagen', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Demo-Person', exact: true }).selectOption('lea');
  const create = page.getByRole('button', { name: 'Treffen erstellen', exact: true });
  if (await create.isVisible()) await create.click();
  else await page.getByRole('button', { name: 'Erstellen', exact: true }).click();
  await page.getByRole('textbox', { name: 'Titel', exact: true }).fill('Basketball Testtreffen');
  await page.getByRole('combobox', { name: 'Sportart', exact: true }).selectOption('Basketball');
  await page.getByRole('textbox', { name: 'Genauer Treffpunkt' }).fill('Campus Sportplatz Ost');
  await page.getByRole('button', { name: 'Treffen veröffentlichen' }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText(
    'Treffpunkt auf der Karte',
  );
  await page.getByRole('button', { name: 'Kartenmitte als Treffpunkt übernehmen' }).click();
  await page.getByRole('button', { name: 'Treffen veröffentlichen' }).click();
  await expect(page.getByRole('dialog').getByText('1 von 10 dabei', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Treffen absagen', exact: true }).click();
  await expect(page.getByRole('dialog').getByText('Abgesagt', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Schließen', exact: true }).click();
  await expect(page.locator('.map-pin')).toHaveCount(0);
});
test('NFR-3: kein horizontaler Überlauf und Tastaturzugang', async ({ page }) => {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('searchbox').focus();
  await page.keyboard.type('Badminton');
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.getByRole('button', { name: 'Badminton zu zweit', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Badminton zu zweit', exact: true })).toBeFocused();
});
