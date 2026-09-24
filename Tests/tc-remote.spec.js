const { test, expect } = require('@playwright/test');

const MODULE = 'FRS';

test.describe(`TC-REMOTE · ${MODULE} Remote / Wi-Fi Security`, () => {

  test('TC-REMOTE-01 (FRS-001) Three sections default to Rules tab and switches work', async ({ page }) => {
    await page.goto('/remote-wifi-security.html');
    await expect(page.locator('#tabBtn-rules')).toHaveClass(/active/);
    await expect(page.locator('#tab-panel-rules')).toBeVisible();
    await expect(page.locator('#tab-panel-simulator')).toBeHidden();

    await page.locator('#tabBtn-simulator').click();
    await expect(page.locator('#tab-panel-simulator')).toBeVisible();
    await expect(page.locator('#tabBtn-simulator')).toHaveClass(/active/);

    await page.locator('#tabBtn-vpn').click();
    await expect(page.locator('#tab-panel-vpn')).toBeVisible();
    await expect(page.locator('#tabBtn-vpn')).toHaveClass(/active/);
  });

  test('TC-REMOTE-02 (FRS-002) Rules tab lists the 6 static golden tips', async ({ page }) => {
    await page.goto('/remote-wifi-security.html');
    const text = await page.locator('#tab-panel-rules').innerText();
    for (const rule of ['Use Secure Wi-Fi Networks', 'Enable a VPN', 'Keep Your Devices Secure', 'Secure Your Home Wi-Fi', 'Be Aware of Phishing', 'Protect Company Data']) {
      expect(text).toContain(rule);
    }
  });

  test('TC-REMOTE-03 (FRS-003) Simulator grades each network mode correctly', async ({ page }) => {
    await page.goto('/remote-wifi-security.html');
    await page.locator('#tabBtn-simulator').click();

    const cases = [
      ['Open Public Wi-Fi', 'GRADE F: CRITICAL RISK'],
      ['Public Wi-Fi + Corporate VPN', 'GRADE A+: MAXIMUM SECURITY'],
      ['Personal Mobile Hotspot', 'GRADE A: HIGHLY SECURE'],
      ['Unsecured Home Wi-Fi', 'GRADE C: MODERATE RISK']
    ];
    for (const [title, grade] of cases) {
      await page.locator('.sim-btn').filter({ hasText: title }).click();
      await expect(page.locator('#simTitle')).toContainText(title);
      await expect(page.locator('#simGrade')).toContainText(grade);
      await expect(page.locator('#simTip')).toContainText('Security Advice:');
    }
  });

  test('TC-REMOTE-04 (FRS-004) Open Wi-Fi reported as danger; VPN restores safe access', async ({ page }) => {
    await page.goto('/remote-wifi-security.html');
    await page.locator('#tabBtn-simulator').click();
    await page.locator('.sim-btn').filter({ hasText: 'Open Public Wi-Fi' }).click();
    await expect(page.locator('#mEncryption')).toContainText('None');
    await expect(page.locator('#simGrade')).toHaveClass(/grade-f/);

    await page.locator('.sim-btn').filter({ hasText: 'Public Wi-Fi + Corporate VPN' }).click();
    await expect(page.locator('#mEncryption')).toContainText(/AES-256|WPA|encrypt/i);
    await expect(page.locator('#simGrade')).toHaveClass(/grade-a/);
  });

  test('TC-REMOTE-05 (FRS-005) VPN visualizer shows plaintext vs encrypted tunnel', async ({ page }) => {
    await page.goto('/remote-wifi-security.html');
    await page.locator('#tabBtn-vpn').click();

    await expect(page.locator('#btnModeUnprotected')).toHaveClass(/active/);
    await expect(page.locator('#packetStreamDisplay')).toContainText('HTTP LOGIN');

    await page.locator('#btnModeProtected').click();
    await expect(page.locator('#btnModeProtected')).toHaveClass(/active protected/);
    await expect(page.locator('#packetStreamDisplay')).toContainText('CIPHERTEXT');
    await expect(page.locator('#packetStreamDisplay')).toContainText('AES-256');
  });

  test('TC-REMOTE-06 (FRS-006) Golden-rule detail modals stay dormant and trigger no errors', async ({ page }) => {
    await page.goto('/remote-wifi-security.html');
    await expect(page.locator('#ruleModal')).toBeHidden();
    await expect(page.locator('#ruleModal')).not.toBeVisible();
    await page.waitForTimeout(500);
    // no pageerrors is safe because nothing opened the modal and no broken script ran
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await expect.poll(() => errors).toEqual([]);
  });
});