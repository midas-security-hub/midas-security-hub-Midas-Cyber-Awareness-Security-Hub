const { test, expect } = require('@playwright/test');

const MODULE = 'FID';
const LIVE_TARGETS = [
  'ai-sensitive-information.html',
  'account-password-security.html',
  'device-security.html',
  'email-security.html',
  'remote-wifi-security.html',
  'physical-security.html',
  'external-incident-reporting.html',
  'police-cyber-crime-advisory.html',
  'faq.html',
  'https://midassafety.sharepoint.com/sites/MidasSecurityHub/SitePages/Report-an-Incident%20page.aspx'
];

test.describe(`TC-PORTAL · ${MODULE} Home Portal Directory`, () => {

  test('TC-PORTAL-01 (FID-001) Hero banner and badge render', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('.hero-banner')).toContainText('Central Security Knowledge Hub');
    await expect(page.locator('.hero-banner h1')).toContainText('Cyber Awareness & Training Directory');
  });

  test('TC-PORTAL-02 (FID-002) Hero stats match the actual topic grid', async ({ page }) => {
    test.fail(); // G-02: hero stat counters were removed from the banner; assertions no longer match
    await page.goto('/index.html');
    const cards = await page.locator('.topic-card').count();
    const live = await page.locator('.topic-card.active-module').count();
    await expect(page.locator('.hero-banner')).toContainText(`${cards} Security Topics`);
    await expect(page.locator('.hero-banner')).toContainText(`${live} Active Live Modules`);
  });

  test('TC-PORTAL-03 (FID-003) Topic grid exposes 10 module cards', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('.topic-card')).toHaveCount(10);
  });

  test('TC-PORTAL-04 (FID-004) All live module cards link to their targets', async ({ page }) => {
    await page.goto('/index.html');
    const hrefs = await page.locator('.topic-card.active-module a[href]').evaluateAll((a) => a.map((x) => x.getAttribute('href')));
    await expect(page.locator('.topic-card.active-module')).toHaveCount(10);
    for (const target of LIVE_TARGETS) {
      expect(hrefs).toContain(target);
    }
  });

  test('TC-PORTAL-05 (FID-005) No planned modules remain; Incident Reporting links to the SharePoint portal', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('.topic-card.coming-soon')).toHaveCount(0);
    const incidentCard = page.locator('.topic-card', { hasText: 'Incident Reporting & Response' });
    await expect(incidentCard).toHaveClass(/active-module/);
    await expect(incidentCard.getByRole('link')).toHaveAttribute('href', 'https://midassafety.sharepoint.com/sites/MidasSecurityHub/SitePages/Report-an-Incident%20page.aspx');
  });

  test('TC-PORTAL-06 (FID-006) Topic search filters cards live', async ({ page }) => {
    await page.goto('/index.html');
    const input = page.locator('#topicSearch');
    await input.pressSequentially('Email Security');
    await expect(page.locator('.topic-card:visible')).toHaveCount(1);
    await expect(page.locator('.topic-card:visible').first()).toContainText('Email Security');
    await input.pressSequentially('zzz-no-match-zzz');
    await expect(page.locator('.topic-card:visible')).toHaveCount(0);
  });

  test('TC-PORTAL-07 (FID-007) Quick Security Tools link to correct targets', async ({ page }) => {
    await page.goto('/index.html');
    const grid = page.locator('.quick-tools-grid');
    await expect(grid.getByRole('link').filter({ hasText: 'Passphrase Evaluator' })).toHaveAttribute('href', 'account-password-security.html#tab-evaluator');
    await expect(grid.getByRole('link').filter({ hasText: 'Device Security Checklist' })).toHaveAttribute('href', 'device-security.html');
    await expect(grid.getByRole('link').filter({ hasText: 'Report Security Incident' })).toHaveAttribute('href', /mailto:cic@midassafety\.com\?subject=Security%20Incident%20Report/);
  });

  test('TC-PORTAL-08 (FID-008) #policies and #news anchor targets exist', async ({ page }) => {
    test.fail(); // G-03: no in-page sections with ids "policies" / "news" exist
    await page.goto('/index.html');
    await expect(page.locator('#policies, #news')).toHaveCount(2);
  });

  test('TC-PORTAL-09 (FID-009) Topic grid uses a responsive grid layout', async ({ page }) => {
    await page.goto('/index.html');
    const display = await page.locator('#topicsContainer').evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe('grid');
  });
});