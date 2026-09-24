const { test, expect } = require('@playwright/test');

const MODULE = 'FPC';

test.describe(`TC-POLICE · ${MODULE} Sri Lanka Police Cyber Crime Advisory`, () => {

  test('TC-POLICE-01 (FPC-001) Bilingual advisory hero with Sinhala subtitle', async ({ page }) => {
    await page.goto('/police-cyber-crime-advisory.html');
    await expect(page.locator('.hero-title')).toContainText('Sri Lanka Police Cyber Crime Advisory');
    await expect(page.locator('.hero-title-sinhala')).toContainText('පොලිස්');
    await expect(page.locator('.hero-badge-tag')).toContainText('Official Sri Lanka Police Public Advisory');
  });

  test('TC-POLICE-02 (FPC-002) Three contact channels with verified SRIs', async ({ page }) => {
    await page.goto('/police-cyber-crime-advisory.html');
    await expect(page.locator('.channel-card')).toHaveCount(3);
    await expect(page.locator('.channel-card.card-cid')).toContainText('Criminal Investigation Dept (CID)');
    await expect(page.locator('.channel-card.card-cid')).toContainText('dir.cid@police.gov.lk');
    await expect(page.locator('.channel-card.card-ccid')).toContainText('Computer Crime Investigation (CCID)');
    await expect(page.locator('.channel-card.card-ccid')).toContainText('ccid.report@police.gov.lk');
    await expect(page.locator('.channel-card.card-phone')).toContainText('011 2381058');
  });

  test('TC-POLICE-03 (FPC-003) Bilingual advisory notice covers account deactivation and suspect arrest', async ({ page }) => {
    await page.goto('/police-cyber-crime-advisory.html');
    const notice = page.locator('.advisory-notice-box');
    await expect(notice).toBeVisible();
    await expect(notice.locator('.notice-body-sinhala')).toBeVisible();
    const english = await notice.locator('.notice-body-english').innerText();
    expect(english).toContain('deactivat');
    expect(english).toContain('arrest');
  });

  test('TC-POLICE-04 (FPC-004) Channel cards carry working call/email actions', async ({ page }) => {
    await page.goto('/police-cyber-crime-advisory.html');
    await expect(page.locator('.channel-card a[href^="tel:"]')).toHaveCount(1);
    await expect(page.locator('.channel-card a[href^="mailto:"]').first()).toHaveAttribute('href', /^mailto:dir\.cid@police\.gov\.lk/);
    await expect(page.locator('.channel-card a[href^="mailto:"]').nth(1)).toHaveAttribute('href', /^mailto:ccid\.report@police\.gov\.lk/);
  });

  test('TC-POLICE-05 (FPC-005) Advisory is free of console errors', async ({ page }) => {
    await page.goto('/police-cyber-crime-advisory.html');
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.waitForTimeout(400);
    expect(errors).toEqual([]);
  });
});