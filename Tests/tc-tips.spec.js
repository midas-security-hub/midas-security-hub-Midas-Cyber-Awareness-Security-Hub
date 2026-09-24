const { test, expect } = require('@playwright/test');

const MODULE = 'FST';

test.describe(`TC-TIPS · ${MODULE} Tips & SOPs Library`, () => {

  test('TC-TIPS-01 (FST-001) Twelve tips render with expected filter controls', async ({ page }) => {
    await page.goto('/security-tips.html');
    await expect(page.locator('.tip-card-item')).toHaveCount(12);
    await expect(page.locator('.cat-check')).toHaveCount(7);
    await expect(page.locator('input[name="audience"]')).toHaveCount(5);
    await expect(page.locator('#sortSelect option')).toHaveCount(2);
    const oc = await page.locator('#resultsCount').innerText();
    expect(oc).toMatch(/Showing 12 tips/);
  });

  test('TC-TIPS-02 (FST-001b) Category checkbox filter narrows the grid', async ({ page }) => {
    await page.goto('/security-tips.html');
    // check "Wi-Fi & Internet"
    const wifi = page.locator('.cat-check[value="Wi-Fi & Internet"]');
    await wifi.check();
    await page.waitForTimeout(100);
    await expect(page.locator('.tip-card-item:visible')).toHaveCount(1);
    await expect(page.locator('.tip-card-item:visible').first()).toContainText('Avoid risky public Wi-Fi');

    // clear all restores every tip
    await page.locator('.clear-btn').click();
    await page.waitForTimeout(100);
    await expect(page.locator('.tip-card-item:visible')).toHaveCount(12);
  });

  test('TC-TIPS-03 (FST-001c) Search finds tips by title keyword', async ({ page }) => {
    await page.goto('/security-tips.html');
    await page.locator('#searchInput').fill('MFA');
    await page.waitForTimeout(100);
    await expect(page.locator('.tip-card-item:visible')).toHaveCount(1);
    await expect(page.locator('.tip-card-item:visible').first()).toContainText('Enable MFA');

    await page.locator('#searchInput').fill('zzz-no-match');
    await page.waitForTimeout(100);
    await expect(page.locator('.tip-card-item:visible')).toHaveCount(0);
  });

  test('TC-TIPS-04 (FST-001d) Audience filter narrows by data-audience', async ({ page }) => {
    await page.goto('/security-tips.html');
    await page.locator('input[name="audience"][value="Field / On the Road"]').check();
    await page.waitForTimeout(100);
    const visible = await page.locator('.tip-card-item:visible').count();
    expect(visible).toBeGreaterThan(0);
    expect(visible).toBeLessThan(12);
  });

  test('TC-TIPS-05 (FST-001e) Sort by Title A-Z reorders cards by title', async ({ page }) => {
    await page.goto('/security-tips.html');
    await page.locator('#sortSelect').selectOption('az');
    await page.waitForTimeout(100);
    const titles = await page.locator('.tip-card-item:visible').evaluateAll((cards) =>
      cards.map((c) => c.getAttribute('data-title').toLowerCase())
    );
    const sorted = [...titles].sort();
    expect(titles).toEqual(sorted);
    expect(titles[0]).toBe('avoid risky public wi-fi');
  });

  test('TC-TIPS-06 (FST-003) Top 5 callout filters to data-top5 tips and updates count', async ({ page }) => {
    await page.goto('/security-tips.html');
    await page.locator('.top5-btn').click();
    await expect(page.locator('#resultsCount')).toContainText('Top 5 Essential Tips');
    const visible = await page.locator('.tip-card-item:visible').count();
    expect(visible).toBe(5);
    for (const id of [1, 2, 3, 8, 9]) {
      await expect(page.locator(`.tip-card-item[data-id="${id}"]`)).toBeVisible();
    }
  });

  test('TC-TIPS-07 (FST-004) "Read more" opens the slide-over article drawer and closes on backdrop', async ({ page }) => {
    await page.goto('/security-tips.html');
    await page.locator('.read-more-link').nth(1).click();
    await expect(page.locator('#articleModal')).toBeVisible();
    await expect(page.locator('#articleTitle')).toContainText('Use strong, unique passphrases');
    await expect(page.locator('#articleModal')).toContainText('Why This Matters');
    await expect(page.locator('#articleModal')).toContainText('ACTION ITEM');

    await page.locator('#articleModal').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('#articleModal')).toBeHidden();

    await page.locator('.read-more-link').nth(2).click();
    await expect(page.locator('#articleModal')).toBeVisible();
    await page.locator('.drawer-close-btn').click();
    await expect(page.locator('#articleModal')).toBeHidden();
  });
});