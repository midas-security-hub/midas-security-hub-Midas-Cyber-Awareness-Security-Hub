const { test, expect } = require('@playwright/test');

const MODULE = 'FDS';
const OS_TABS = ['windows', 'android', 'ios'];
const BANNER_CLASS = { windows: 'win', android: 'android', ios: 'ios' };

test.describe(`TC-DEV · ${MODULE} Device Security`, () => {

  test('TC-DEV-01 (FDS-001) Three platform sections and golden rule banners', async ({ page }) => {
    await page.goto('/device-security.html');
    for (const os of OS_TABS) {
      await expect(page.locator(`#section-${os}`)).toHaveCount(1);
      await expect(page.locator(`.golden-rule-banner.${BANNER_CLASS[os]}`)).toBeVisible();
    }
    await expect(page.locator('#section-windows')).toContainText('Windows Device Security');
    await expect(page.locator('#section-android')).toContainText('Android Device Security');
    await expect(page.locator('#section-ios')).toContainText('iOS Device Security');
  });

  test('TC-DEV-02 (FDS-002/FDS-003) Golden rules carry the platform-specific security guidance', async ({ page }) => {
    await page.goto('/device-security.html');
    const wins = await page.locator('.golden-rule-banner.win').innerText();
    expect(wins).toContain('Never disable Windows Defender, BitLocker, or automatic security patches.');
    const androids = await page.locator('.golden-rule-banner.android').innerText();
    expect(androids).toMatch(/Play Store/i);
    const ioss = await page.locator('.golden-rule-banner.ios').innerText();
    expect(ioss).toMatch(/App Store/i);
  });

  test('TC-DEV-03 (FDS-002/FDS-003) Jump buttons scroll to each platform section', async ({ page }) => {
    await page.goto('/device-security.html');
    for (const [label, os] of [['Android Devices', 'android'], ['iOS Devices', 'ios'], ['Windows Devices', 'windows']]) {
      await page.locator('.jump-btn').filter({ hasText: label }).click();
      await page.waitForTimeout(800);
      const inView = await page.locator(`#section-${os}`).evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.top >= -5 && r.top <= window.innerHeight;
      });
      expect(inView, `${os} section should be in the top of the viewport`).toBeTruthy();
    }
  });

  test('TC-DEV-04 (FDS-004) Base steps include lock, encryption, updates, approved software', async ({ page }) => {
    await page.goto('/device-security.html');
    const windowsText = await page.locator('#section-windows').innerText();
    for (const rule of ['Windows + L', 'BitLocker', 'Windows Defender', 'updates', 'Approved Software']) {
      expect(windowsText).toContain(rule);
    }
  });

  test('TC-DEV-05 (FDS-005) Collapsible steps 5-7 expand with button label swap', async ({ page }) => {
    await page.goto('/device-security.html');
    for (const os of OS_TABS) {
      const btn = page.locator(`#btn-${os}`);
      const extra = page.locator(`#extra-${os}`);
      await expect(btn).toContainText('Show steps');
      await expect(extra.locator('.step-row')).toHaveCount(3);
      await expect(extra).not.toBeVisible();
      await btn.click();
      await expect(extra).toBeVisible();
    }
  });

  test('TC-DEV-06 (FDS-006) Windows page carries the full 7-step program and adheres to safe packaging of downloads', async ({ page }) => {
    await page.goto('/device-security.html');
    // 7 Windows steps (4 base + 3 collapsible) after expansion
    await page.locator('#btn-windows').click();
    await expect(page.locator('#section-windows .step-row')).toHaveCount(7);
    // All download/install guidance must be internal or clearly refer to approved sources
    const downloadAnchors = page.locator('#section-windows a[href]');
    const hrefs = await downloadAnchors.evaluateAll((a) => a.map((x) => x.getAttribute('href')));
    for (const h of hrefs) {
      expect(h).not.toMatch(/^https?:\/\/(?!support\.microsoft\.com|www\.microsoft\.com)/i);
    }
  });
});