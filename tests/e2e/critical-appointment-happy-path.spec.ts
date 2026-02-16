import { expect, test } from '@playwright/test';

test('Terminbuchungs-Happy-Path: Fahrzeugdaten eingeben und Verfügbarkeit prüfen', async ({ page }) => {
  await page.goto('/werkstatt');

  await expect(page.getByRole('heading', { name: /Meisterlicher Service/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Termin anfragen' })).toBeVisible();

  const hsnTsnInput = page.getByPlaceholder('z.B. 0603 / BDE');
  await hsnTsnInput.fill('0603 / ADO');
  await expect(hsnTsnInput).toHaveValue('0603 / ADO');

  await page.getByRole('button', { name: 'Verfügbarkeit prüfen' }).click();

  await expect(page.getByText('Blitz-Antwort')).toBeVisible();
  await expect(page.getByText('SSL Verschlüsselt')).toBeVisible();
});
