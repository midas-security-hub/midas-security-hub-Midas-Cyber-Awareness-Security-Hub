const { test, expect } = require('@playwright/test');

const MODULE = 'FFA';

async function typeSearch(page, text) {
  const input = page.locator('#faqSearch');
  await input.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  if (text) await input.pressSequentially(text);
}

test.describe(`TC-FAQ · ${MODULE} FAQ Help Center`, () => {

  test('TC-FAQ-01 (FFA-001) Help center hero and 12 question cards', async ({ page }) => {
    await page.goto('/faq.html');
    await expect(page.locator('.faq-hero-badge')).toContainText('Midas Security Help Center');
    await expect(page.locator('.faq-card')).toHaveCount(12);
  });

  test('TC-FAQ-02 (FFA-002) Questions expand and close as an accordion', async ({ page }) => {
    await page.goto('/faq.html');
    const first = page.locator('.faq-card').nth(0);
    await first.locator('.faq-question-btn').click();
    await expect(first).toHaveClass(/open/);
    await expect(first.locator('.faq-answer-body')).toBeVisible();
    await expect(page.locator('.faq-card.open')).toHaveCount(1);

    await first.locator('.faq-question-btn').click();
    await expect(first).not.toHaveClass(/open/);

    // opening a second card closes the first (accordion)
    await page.locator('.faq-card').nth(1).locator('.faq-question-btn').click();
    await expect(page.locator('.faq-card.open')).toHaveCount(1);
    await expect(page.locator('.faq-card').nth(0)).not.toHaveClass(/open/);
  });

  test('TC-FAQ-03 (FFA-003) Category filter shows only matching cards', async ({ page }) => {
    await page.goto('/faq.html');
    const pass = page.locator('.nav-category-btn').filter({ hasText: 'Passwords & Accounts' });
    await pass.click();
    await expect(pass).toHaveClass(/active/);
    await expect(page.locator('.faq-card[data-cat="pass"]')).toHaveCount(3);
    await expect(page.locator('.faq-card:visible[data-cat="pass"]')).toHaveCount(3);
    const anyHiddenCatVisible = await page.locator('.faq-card:visible:not([data-cat="pass"])').count();
    expect(anyHiddenCatVisible).toBe(0);

    await page.locator('.nav-category-btn').filter({ hasText: 'All Questions' }).click();
    await expect(page.locator('.faq-card:visible')).toHaveCount(12);
  });

  test('TC-FAQ-04 (FFA-004) Live search filters by keyword data', async ({ page }) => {
    await page.goto('/faq.html');
    await typeSearch(page, 'phishing');
    const visible = await page.locator('.faq-card:visible').count();
    expect(visible).toBeGreaterThan(0);
    expect(visible).toBeLessThan(12);

    await typeSearch(page, 'win+l');
    await expect(page.locator('.faq-card:visible')).toHaveCount(1);

    await typeSearch(page, '');
    await expect(page.locator('.faq-card:visible')).toHaveCount(12);
  });

  test('TC-FAQ-04b (FFA-004) No results returns an empty list without errors', async ({ page }) => {
    await page.goto('/faq.html');
    await page.locator('#faqSearch').pressSequentially('zzz-no-such-topic-999');
    await expect(page.locator('.faq-card:visible')).toHaveCount(0);
  });

  test('TC-FAQ-05 (FFA-005) Feedback buttons thank the user', async ({ page }) => {
    await page.goto('/faq.html');
    const card = page.locator('.faq-card').nth(0);
    await card.locator('.faq-question-btn').click();
    const yes = card.locator('.feedback-btn').filter({ hasText: 'Yes' });
    await yes.click();
    await expect(card).toContainText('Thank you for your feedback');
  });

  test('TC-FAQ-06 (FFA-006) Category counts match the number of cards', async ({ page }) => {
    await page.goto('/faq.html');
    const counts = await page.evaluate(() => {
      const byCat = {};
      for (const card of document.querySelectorAll('.faq-card[data-cat]')) {
        const k = card.dataset.cat;
        byCat[k] = (byCat[k] || 0) + 1;
      }
      const btnCounts = {};
      for (const btn of document.querySelectorAll('.nav-category-btn')) {
        const m = (btn.getAttribute('onclick') || '').match(/'([^']+)'/);
        const k = m ? m[1] : null;
        const n = parseInt((btn.querySelector('.cat-count') || { textContent: '0' }).textContent.trim(), 10);
        btnCounts[k] = n;
      }
      return { byCat, btnCounts };
    });
    for (const [cat, n] of Object.entries(counts.byCat)) {
      expect(counts.btnCounts[cat], `count badge for ${cat}`).toBe(n);
    }
  });

  test('TC-FAQ-07 (FFA-007) Advertised "Ask the SOC" control is functional', async ({ page }) => {
    test.fail(); // G-04: no working "Ask the SOC" form exists; only dead CSS .ask-box-card
    await page.goto('/faq.html');
    await expect(page.locator('.ask-box-card, #askSocForm')).toHaveCount(1);
  });

  test('TC-FAQ-08 (FFA-008) No console errors during search/filter/feedback', async ({ page }) => {
    await page.goto('/faq.html');
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await typeSearch(page, 'MFA');
    await page.locator('.nav-category-btn').nth(2).click();
    await typeSearch(page, '');
    const visibleCard = page.locator('.faq-card:visible').first();
    await visibleCard.locator('.faq-question-btn').click();
    await visibleCard.locator('.feedback-btn').first().click();
    await page.waitForTimeout(200);
    expect(errors).toEqual([]);
  });
});