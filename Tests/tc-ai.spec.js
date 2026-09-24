const { test, expect } = require('@playwright/test');

const MODULE = 'FAI';

const CLASSIFICATIONS = {
  public_marketing: 'PUBLIC',
  internal_memos: 'INTERNAL',
  restricted_customer: 'RESTRICTED',
  restricted_financial: 'RESTRICTED',
  restricted_formulas: 'RESTRICTED',
  prohibited_health: 'PROHIBITED',
  prohibited_code: 'PROHIBITED',
  prohibited_secrets: 'PROHIBITED',
  prohibited_legal: 'PROHIBITED'
};

test.describe(`TC-AI · ${MODULE} AI & Sensitive Information`, () => {

  test('TC-AI-01 (FAI-001) Hero title and value props render', async ({ page }) => {
    await page.goto('/ai-sensitive-information.html');
    await expect(page.locator('.ai-hero-banner')).toContainText('Smart People.');
    await expect(page.locator('.ai-hero-banner')).toContainText('Responsible AI.');
    await expect(page.locator('.ai-hero-banner')).toContainText('Protect our data & IP');
    await expect(page.locator('.ai-hero-banner')).toContainText('Respect our people');
    await expect(page.locator('.ai-hero-banner')).toContainText('Build customer trust');
  });

  test('TC-AI-02 (FAI-002) Classifier widget flow + empty-selection guard', async ({ page }) => {
    await page.goto('/ai-sensitive-information.html');

    // No selection -> alert
    let msg = '';
    const dialogP = new Promise((resolve) => page.once('dialog', async (d) => { msg = d.message(); await d.accept(); resolve(); }));
    await page.locator('#submitBtn').click();
    await dialogP;
    expect(msg).toContain('select a data type');

    await page.locator('#selectTrigger').click();
    await page.locator('.select-option').filter({ hasText: 'Customer data, supplier records & contracts' }).click();
    await expect(page.locator('#submitBtn')).toHaveClass(/active/);
    await page.locator('#submitBtn').click();
    await expect(page.locator('#heroResultCard')).toBeVisible();
    await expect(page.locator('#heroResultCard')).toContainText('RESTRICTED');
    await expect(page.locator('#heroResultCard')).toContainText('approval');
  });

  test('TC-AI-03 (FAI-003) All nine classifier rules return the correct classification', async ({ page }) => {
    await page.goto('/ai-sensitive-information.html');
    for (const [value, expected] of Object.entries(CLASSIFICATIONS)) {
      await page.locator('#selectTrigger').click();
      const option = page.locator(`.select-option[onclick*="'${value}'"]`);
      await expect(option).toHaveCount(1);
      await option.click();
      await page.locator('#submitBtn').click();
      await expect(page.locator('#heroResultCard')).toContainText(expected, { timeout: 3000 });
      await expect(page.locator('#heroResultCard')).toBeVisible();
    }
  });

  test('TC-AI-04 (FAI-004) Six principles open detail panels and switch selection', async ({ page }) => {
    await page.goto('/ai-sensitive-information.html');
    await expect(page.locator('.principle-card-item')).toHaveCount(6);

    const box = page.locator('#principleDetailBox');
    await expect(box).toBeHidden();

    await page.locator('#principleCard-0').click();
    await expect(box).toBeVisible();
    await expect(box).toContainText('Human Accountability');
    await expect(box).toContainText('Key Guidelines');
    await expect(page.locator('#principleCard-0')).toHaveClass(/active-card/);

    await page.locator('#principleCard-3').click();
    await expect(box).toContainText('Data Security');
    await expect(page.locator('#principleCard-3')).toHaveClass(/active-card/);
    await expect(page.locator('#principleCard-0')).not.toHaveClass(/active-card/);

    await page.locator('#principleDetailBox button').first().click();
    await expect(box).toBeHidden();
  });

  test('TC-AI-05 (FAI-005) Four-tier information classification table', async ({ page }) => {
    await page.goto('/ai-sensitive-information.html');
    const rows = page.locator('.info-class-table tbody tr, .info-class-table tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(4);
    const text = await page.locator('.info-class-table').innerText();
    for (const tier of ['Public', 'Internal', 'Restricted', 'Prohibited']) {
      expect(text).toContain(tier);
    }
  });

  test('TC-AI-06 (FAI-006) Red Zone lists prohibited uses and warning', async ({ page }) => {
    await page.goto('/ai-sensitive-information.html');
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('When in doubt, don\'t input it.');
    expect(bodyText).toContain('trade secrets');
    expect(bodyText).toContain('unapproved');
    expect(bodyText).toContain('Bypass security controls');
  });

  test('TC-AI-07 (FAI-007) Video briefing player renders with working controls', async ({ page }) => {
    await page.goto('/ai-sensitive-information.html');
    const video = page.locator('#aiPolicyVideo');
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute('muted', '');

    const audioBtn = page.locator('#videoAudioBtn');
    await expect(audioBtn).toContainText('Muted');
    await audioBtn.click();
    await expect(page.locator('#videoAudioBtn')).toContainText('Sound ON');
    await audioBtn.click();
    await expect(page.locator('#videoAudioBtn')).toContainText('Muted');

    const pb = page.locator('#videoPlayPauseBtn');
    // Drive the real toggle handler deterministically by faking video.paused state
    await video.evaluate((v) => {
      Object.defineProperty(v, 'paused', { configurable: true, get: () => window.__fakePaused });
      window.__fakePaused = false;
    });
    await pb.click(); // not paused -> pause branch -> play icon swapped to pause glyph, then ▶️ on pause branch
    await expect(pb).toContainText('▶');
    await page.evaluate(() => { window.__fakePaused = true; });
    await pb.click(); // paused -> play branch -> ⏸️
    await expect(pb).toContainText('⏸');

    await expect(page.locator('#videoTimeDisplay')).toContainText('0:00');
  });

  test('TC-AI-08 (FAI-008) Policy PDF reachable from multiple touch-points', async ({ page }) => {
    await page.goto('/ai-sensitive-information.html');
    const pdfLinks = page.locator('a[href*="AI Policy_v1.pdf"], a[href*="AI%20Policy_v1.pdf"]');
    expect(await pdfLinks.count()).toBeGreaterThanOrEqual(3);
  });

  test('TC-AI-09 (FAI-009) Policy metadata dates shown', async ({ page }) => {
    await page.goto('/ai-sensitive-information.html');
    const text = await page.locator('body').innerText();
    expect(text).toContain('24 Aug 2026');
    expect(text).toContain('Aug 2027');
  });

  test('TC-AI-10 (FAI-010) Reduced header has no favorites/site-access buttons', async ({ page }) => {
    await page.goto('/ai-sensitive-information.html');
    await expect(page.locator('.nav-action-btn')).toHaveCount(0);
  });
});