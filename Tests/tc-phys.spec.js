const { test, expect } = require('@playwright/test');

const MODULE = 'FHS';

test.describe(`TC-PHYS · ${MODULE} Physical & Social Engineering`, () => {

  test('TC-PHYS-01 (FHS-001) Hero shows the core awareness statement and badges', async ({ page }) => {
    await page.goto('/physical-security.html');
    await expect(page.locator('.hero-physical-banner h1')).toContainText('Physical & Social Engineering Security');
    await expect(page.locator('.hero-physical-banner')).toContainText('Badge Discipline');
    await expect(page.locator('.hero-physical-banner')).toContainText('Visitor Verification');
    await expect(page.locator('.hero-physical-banner')).toContainText('Tailgating Defense');
  });

  test('TC-PHYS-02 (FHS-002) Seven simple habits grid with expected titles', async ({ page }) => {
    await page.goto('/physical-security.html');
    await expect(page.locator('.habits-header-title')).toContainText('7 Simple Habits');
    await expect(page.locator('.habit-card')).toHaveCount(7);
    await expect(page.locator('.habit-card').filter({ hasText: "Don't tailgate through secure doors" })).toBeVisible();
    await expect(page.locator('.habit-card').filter({ hasText: 'Never plug in unknown USB drives' })).toBeVisible();
    await expect(page.locator('.habit-card').filter({ hasText: 'Be aware of shoulder surfing' })).toBeVisible();
    await expect(page.locator('.habit-card').filter({ hasText: 'Report lost or stolen badges immediately' })).toBeVisible();
  });

  test('TC-PHYS-03 (FHS-003) Tailgating defense and clean-desk guidance present with practical tips', async ({ page }) => {
    await page.goto('/physical-security.html');
    const text = await page.locator('body').innerText();
    expect(text).toContain('ask them to show their badge');
    expect(text).toContain('Lock computer screens');
    expect(text).toContain('report it to IT immediately');
  });

  test('TC-PHYS-04 (FHS-004) Locking workstations is taught across the physical module too', async ({ page }) => {
    await page.goto('/physical-security.html');
    const text = await page.locator('body').innerText();
    expect(text).toContain('Win + L');
    expect(text).toContain('clean desk');
  });
});