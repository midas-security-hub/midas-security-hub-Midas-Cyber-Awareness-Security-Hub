const { test, expect } = require('@playwright/test');

const MODULE = 'FES';

test.describe(`TC-EMAIL · ${MODULE} Email & Phishing Security`, () => {

  test('TC-EMAIL-01 (FES-001) Mock inbox presents 8 hotspot badges (7 red flags + 1 green action)', async ({ page }) => {
    await page.goto('/email-security.html');
    await expect(page.locator('.red-hotspot-badge')).toHaveCount(7);
    await expect(page.locator('.green-hotspot-badge')).toHaveCount(1);
    await expect(page.locator('#field-1')).toBeVisible();
    await expect(page.locator('#field-8')).toBeVisible();
    await expect(page.locator('.outlook-window')).toHaveCount(1);
  });

  test('TC-EMAIL-02 (FES-002) Eight red-flag fields with collapsible 4-8 set', async ({ page }) => {
    await page.goto('/email-security.html');
    for (let i = 1; i <= 8; i++) {
      await expect(page.locator(`#field-${i}`)).toHaveCount(1);
    }
    await expect(page.locator('#flag-card-5')).toHaveClass(/card-hidden/);
    await expect(page.locator('#toggleBtnText')).toContainText('Show 4');
    await page.locator('#toggleFlagsBtn').click();
    await expect(page.locator('#flag-card-5')).not.toHaveClass(/card-hidden/);
    await expect(page.locator('#toggleBtnText')).toContainText('Show Less');
  });

  test('TC-EMAIL-03 (FES-003) Hovering a red-flag shows the spotter tooltip', async ({ page }) => {
    await page.goto('/email-security.html');
    await page.locator('#field-2').hover();
    await expect(page.locator('#spotterPopover')).toBeVisible();
    await expect(page.locator('#popoverTitle')).toContainText('TO: UNEXPECTED RECIPIENTS');
    await expect(page.locator('#popoverDesc')).toContainText("weren't expecting");
  });

  test('TC-EMAIL-04 (FES-004) Known-breach email reports exposed status with tag chips', async ({ page }) => {
    await page.goto('/email-security.html');
    await page.locator('#emailCheckInput').fill('test@example.com');
    await page.locator('.verifier-check-btn').click();
    await expect(page.locator('#verifierResultBox')).toHaveClass(/exposed/);
    await expect(page.locator('#verifierResultBox')).toContainText('EXPOSED IN DATA BREACH');
    const chips = await page.locator('.breach-tag-chip').count();
    expect(chips).toBeGreaterThanOrEqual(1);
    const link = await page.locator('#verifierResultBox .hibp-direct-btn').getAttribute('href');
    expect(link).toContain('haveibeenpwned.com/account/test%40example.com');
  });

  test('TC-EMAIL-05 (FES-004b + FES-005) Unknown email queries the public API and renders CLEAN', async ({ page }) => {
    await page.goto('/email-security.html');
    await page.route('**/api.xposedornot.com/**', (route) =>
      route.fulfill({ json: { breaches: [] } })
    );
    await page.locator('#emailCheckInput').fill('no-breaches@example.com');
    await page.locator('.verifier-check-btn').click();
    await expect(page.locator('#verifierResultBox')).toHaveClass(/safe/);
    await expect(page.locator('#verifierResultBox')).toContainText('CLEAN IN PUBLIC APIS');
    const link = await page.locator('#verifierResultBox .hibp-direct-btn').getAttribute('href');
    expect(link).toContain('haveibeenpwned.com/account/no-breaches%40example.com');
  });

  test('TC-EMAIL-06 (FES-005b) API exposure branch renders counts and chips (up to 16)', async ({ page }) => {
    await page.goto('/email-security.html');
    const names = Array.from({ length: 20 }, (_, i) => 'Breach' + i);
    await page.route('**/api.xposedornot.com/**', (route) =>
      route.fulfill({ json: { breaches: [names] } })
    );
    await page.locator('#emailCheckInput').fill('leaked@example.com');
    await page.locator('.verifier-check-btn').click();
    await expect(page.locator('#verifierResultBox')).toHaveClass(/exposed/);
    await expect(page.locator('#verifierResultBox')).toContainText('EXPOSED IN 20 DATA BREACHES');
    await expect(page.locator('.breach-tag-chip')).toHaveCount(17); // 16 chips + +4 more
    await expect(page.locator('#verifierResultBox')).toContainText('+ 4 more');
  });

  test('TC-EMAIL-07 (FES-006) Invalid email shows validation message, not a result', async ({ page }) => {
    await page.goto('/email-security.html');
    await page.locator('#emailCheckInput').fill('not-an-email');
    await page.locator('.verifier-check-btn').click();
    await expect(page.locator('#verifierResultBox')).toContainText('Please enter a valid email address');
    await expect(page.locator('#verifierResultBox')).not.toContainText('EXPOSED');
  });

  test('TC-EMAIL-08 (FES-007 + FES-008) Red flags mapped to field rows and badges in the mock inbox', async ({ page }) => {
    await page.goto('/email-security.html');
    for (let i = 1; i <= 8; i++) {
      await expect(page.locator(`#badge-${i}`)).toHaveCount(1);
    }
    const greenBadges = await page.locator('.green-hotspot-badge').count();
    expect(greenBadges).toBeGreaterThanOrEqual(1);
    // Field 8 must present the good action (Report ▾ button) mapping to a 'Report Phishing' card
    await expect(page.locator('#field-8')).toHaveClass(/highlight-report/);
    await expect(page.locator('#field-8')).toContainText('Report');
    await expect(page.locator('#flag-card-8')).toContainText('Report Phishing');
  });
});