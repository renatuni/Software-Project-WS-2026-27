import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/tile.openstreetmap.org/**', (route) => route.abort());
  await page.goto('/');
});

test('Lukas: Altersgruppe und freie Plätze auf den echten Next.js-Karten', async ({ page }) => {
  const football = page.getByRole('article').filter({ hasText: 'Fußball am Campus' });
  await expect(football.getByText('Altersgruppe: 20–25 Jahre', { exact: true })).toBeVisible();
  await expect(football.getByText('5 von 10 Plätzen frei', { exact: true })).toBeVisible();
  await expect(page.getByText('Ausgebucht · 0 Plätze frei', { exact: true })).toBeVisible();
  const badminton = page.getByRole('article').filter({ hasText: 'Badminton zu zweit' });
  await expect(badminton.getByText('1 von 2 Plätzen frei', { exact: true })).toBeVisible();
  await expect(
    badminton.getByText('Altersgruppe: Alle Altersgruppen', { exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('Lukas: sichtbare Teilnahmeaktion ohne vorgetäuschten Erfolg', async ({ page }) => {
  const buttons = page
    .getByRole('article')
    .getByRole('button', { name: 'Jetzt teilnehmen', exact: true });
  await expect(buttons).toHaveCount(3);
  for (const button of await buttons.all()) {
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-describedby', /.+/);
  }
  const badminton = page.getByRole('article').filter({ hasText: 'Badminton zu zweit' });
  await expect(badminton.getByRole('status')).toHaveText(
    'Echte Anmeldung noch nicht verfügbar. Es wird kein Platz reserviert.',
  );
  await page.getByRole('combobox', { name: 'Demo-Person', exact: true }).selectOption('lea');
  await expect(badminton.getByRole('button', { name: 'Jetzt teilnehmen' })).toBeDisabled();
  await expect(badminton.getByText('1 von 2 Plätzen frei', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Badminton zu zweit', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Badminton zu zweit', exact: true })).toBeFocused();
});
