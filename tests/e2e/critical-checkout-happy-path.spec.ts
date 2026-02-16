import { expect, test } from '@playwright/test';

test('Checkout Happy Path: Produkt konfigurieren und in den Warenkorb legen', async ({ page }) => {
  await page.goto('/shop/produkt/bremsscheibe');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('inkl. 20% MwSt., zzgl. Versandkosten')).toBeVisible();

  const quantityInput = page.locator('input[type="number"]');
  await quantityInput.fill('2');
  await expect(quantityInput).toHaveValue('2');

  await page.getByRole('button', { name: 'In den Warenkorb' }).click();

  await expect(page.getByRole('button', { name: 'In den Warenkorb' })).toBeVisible();
  await expect(page.getByText('2 Jahre Garantie')).toBeVisible();
});
