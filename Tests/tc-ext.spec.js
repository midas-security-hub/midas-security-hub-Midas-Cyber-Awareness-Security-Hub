const { test, expect } = require('@playwright/test');

const MODULE = 'FXR';

test.describe(`TC-EXT · ${MODULE} External Incident Reporting`, () => {

  test('TC-EXT-01 (FXR-001) Wizard offers five escalation scenarios', async ({ page }) => {
    await page.goto('/external-incident-reporting.html');
    const btns = page.locator('.wiz-btn');
    await expect(btns).toHaveCount(5);
    await expect(btns.nth(0)).toContainText('Urgent Assistance & Cyber Attack');
    await expect(btns.nth(1)).toContainText('Cyber Crime & Financial Fraud');
    await expect(btns.nth(2)).toContainText('General Cyber Incident & Technical Escalation');
    await expect(btns.nth(3)).toContainText('Social Media & Online Unlawful Content');
    await expect(btns.nth(4)).toContainText('Formal Online Complaint Portals');
  });

  test('TC-EXT-02 (FXR-002) Selecting a scenario populates the result box', async ({ page }) => {
    await page.goto('/external-incident-reporting.html');
    await page.locator('.wiz-btn').nth(1).click();
    await expect(page.locator('#wizResTitle')).toContainText('Cyber Crime & Financial Fraud');
    await expect(page.locator('#wizResultBox')).toBeVisible();

    await page.locator('.wiz-btn').nth(4).click();
    await expect(page.locator('#wizResTitle')).toContainText('Official Online Complaint Portals');
  });

  test('TC-EXT-03 (FXR-003) Default scenario shows emergency hotlines 101 / 1799', async ({ page }) => {
    await page.goto('/external-incident-reporting.html');
    const body = await page.locator('#wizResBody').innerText();
    expect(body).toContain('101');
    expect(body).toContain('1799');
  });

  test('TC-EXT-04 (FXR-004) Country filter buttons switch visible countries', async ({ page }) => {
    await page.goto('/external-incident-reporting.html');
    await expect(page.locator('.country-tab-btn')).toHaveCount(4);

    await page.locator('.country-tab-btn').filter({ hasText: 'Sri Lanka' }).click();
    await expect(page.locator('#country-lk')).toBeVisible();
    await expect(page.locator('#country-bd')).toBeHidden();
    await expect(page.locator('#country-pk')).toBeHidden();

    await page.locator('.country-tab-btn').filter({ hasText: 'Bangladesh' }).click();
    await expect(page.locator('#country-bd')).toBeVisible();
    await expect(page.locator('#country-lk')).toBeHidden();

    await page.locator('.country-tab-btn').filter({ hasText: 'View All Countries' }).click();
    await expect(page.locator('#country-lk')).toBeVisible();
    await expect(page.locator('#country-bd')).toBeVisible();
  });

  test('TC-EXT-05 (FXR-005) Sri Lanka section exposes SL CERT hotline 101 and CID', async ({ page }) => {
    await page.goto('/external-incident-reporting.html');
    await expect(page.locator('#channels a[href="tel:101"]')).toBeVisible();
    const text = await page.locator('#country-lk').innerText();
    expect(text).toContain('Cyber Crime Division');
    expect(text).toContain('SL CERT');
  });

  test('TC-EXT-06 (FXR-006) Every country section has actionable tel/email/portal links', async ({ page }) => {
    await page.goto('/external-incident-reporting.html');
    for (const id of ['#country-lk', '#country-bd', '#country-pk']) {
      const tel = await page.locator(`${id} a[href^="tel:"]`).count();
      const mail = await page.locator(`${id} a[href^="mailto:"]`).count();
      const http = await page.locator(`${id} a[href^="http"]`).count();
      expect(tel + mail + http, `${id} should have escalation links`).toBeGreaterThan(0);
    }
  });

  test('TC-EXT-07 (FXR-007) Pakistan section references NCCIA portal', async ({ page }) => {
    await page.goto('/external-incident-reporting.html');
    await page.locator('.country-tab-btn').filter({ hasText: 'Pakistan' }).click();
    const text = await page.locator('#country-pk').innerText();
    expect(text).toContain('NCCIA');
  });

  test('TC-EXT-08 (FXR-008) The reporting workflow steps are documented in a timeline', async ({ page }) => {
    await page.goto('/external-incident-reporting.html');
    await expect(page.locator('.timeline-card').first()).toBeVisible();
  });

  test('TC-EXT-09 (FXR-009) No console errors while exercising the wizard', async ({ page }) => {
    await page.goto('/external-incident-reporting.html');
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (let i = 0; i < 5; i++) {
      await page.locator('.wiz-btn').nth(i).click();
    }
    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
  });
});