const { test, expect } = require('@playwright/test');
const { attachErrorCapture, expectNoConsoleErrors, noHorizontalOverflow } = require('./helpers');

const MODULE = 'FND';

test.describe(`TC-NAV · ${MODULE} Global UI`, () => {

  test('TC-NAV-01 (FND-001) Header brand, navbar and key links render', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('img[alt="Midas SOC Logo"]').first()).toBeVisible();
    await expect(page.locator('.site-title-text')).toContainText('Midas Cyber Awareness & Security Hub');
    const navbar = page.locator('.site-navbar');
    await expect(navbar).toContainText('Home');
    await expect(navbar).toContainText('Topics');
    await expect(navbar).toContainText('Policies');
    await expect(navbar).toContainText('News');
    await expect(navbar).toContainText('FAQ');
    await expect(navbar.locator('a.nav-link[href="external-incident-reporting.html"]')).toBeVisible();
  });

  test('TC-NAV-02 (FND-002) Topics dropdown exposes all expected links', async ({ page }) => {
    await page.goto('/index.html');
    const topics = page.locator('.nav-item').filter({ hasText: 'Topics' });
    await topics.getByRole('button').hover();
    const links = topics.locator('.nav-dropdown a.dropdown-link');
    const expected = [
      ['ai-sensitive-information.html', /AI & Sensitive Information/],
      ['account-password-security.html', /Account & Password\s+Security/],
      ['device-security.html', /Device Security/],
      ['email-security.html', /Email & Phishing/],
      ['physical-security.html', /Physical Security/],
      ['remote-wifi-security.html', /Remote \/ Wi-Fi\s+Security/],
      ['index.html#policies', /Security Policies/],
      ['faq.html', /FAQ/],
      ['security-tips.html', /SOPS/]
    ];
    await expect(links).toHaveCount(expected.length);
    for (const [href, label] of expected) {
      await expect(topics.locator(`a[href="${href}"]`)).toBeVisible();
      await expect(topics.locator(`a[href="${href}"]`)).toContainText(label);
    }
  });

  test('TC-NAV-03 (FND-003) Dropdown opens on hover and click toggle (single open)', async ({ page }) => {
    await page.goto('/index.html');
    const topics = page.locator('.nav-item').filter({ hasText: 'Topics' });
    const resources = page.locator('.nav-item').filter({ hasText: 'Resources' });

    await topics.getByRole('button').hover();
    await expect(topics.locator('.nav-dropdown')).toBeVisible();

    await resources.getByRole('button').click();
    await expect(resources.locator('.nav-dropdown')).toBeVisible();
    await expect(topics.locator('.nav-dropdown')).not.toBeVisible();
  });

  test('TC-NAV-03b (FND-003) Dropdown closes on outside click', async ({ page }) => {
    test.fail(); // G-06: outside-click close handler not implemented on most pages
    await page.goto('/index.html');
    const topics = page.locator('.nav-item').filter({ hasText: 'Topics' });
    await topics.getByRole('button').click();
    await page.locator('.hero-banner').click({ position: { x: 5, y: 5 } });
    await expect(topics.locator('.nav-dropdown')).not.toBeVisible();
  });

  test('TC-NAV-04 (FND-004) Add-to-favorites toggles label on device page (handler defined)', async ({ page }) => {
    await page.goto('/device-security.html');
    const fav = page.locator('.nav-action-btn').filter({ has: page.locator('#favText') });
    await expect(fav).toHaveCount(1);
    await expect(page.locator('#favText')).toContainText('Add to favorites');
    await fav.click();
    await expect(page.locator('#favText')).toContainText('Added to favorites');
    await fav.click();
    await expect(page.locator('#favText')).toContainText('Add to favorites');
  });

  test('TC-NAV-05 (FND-005) Site access button shows informational alert', async ({ page }) => {
    await page.goto('/index.html');
    let msg = '';
    page.once('dialog', async (d) => { msg = d.message(); await d.accept(); });
    await page.locator('.nav-action-btn').filter({ hasText: 'Site access' }).click();
    await expect.poll(() => msg).toContain('full employee access');
  });

  test('TC-NAV-06 (FND-006) Active section is highlighted on its own page', async ({ page }) => {
    await page.goto('/ai-sensitive-information.html');
    const highlighted = page.locator('.dropdown-link.active, .nav-link.active');
    expect(await highlighted.count()).toBeGreaterThan(0);
    await expect(highlighted.first()).toHaveClass(/active/);
  });

  test('TC-NAV-07 (FND-007) Footer renders brand, SOC contact and 4 action buttons', async ({ page }) => {
    await page.goto('/index.html');
    const footer = page.locator('.midas-footer-container');
    await expect(footer.locator('a.contact-red-btn')).toHaveAttribute('href', 'mailto:cic@midassafety.com');
    await expect(footer.locator('a.soc-email-link')).toHaveAttribute('href', 'mailto:cic@midassafety.com');
    await expect(footer.locator('a.action-btn-circle')).toHaveCount(4);
    await expect(footer.locator('a.action-btn-circle').nth(0)).toHaveAttribute('href', /mailto:cic@midassafety\.com\?subject=Security%20Incident%20Report/);
    await expect(footer.locator('a.action-btn-circle').nth(1)).toHaveAttribute('href', 'security-tips.html');
    await expect(footer.locator('a.action-btn-circle').nth(2)).toHaveAttribute('href', 'index.html#news');
    await expect(footer.locator('a.action-btn-circle').nth(3)).toHaveAttribute('href', 'index.html');
  });

  test('TC-NAV-08 (FND-008) Brand assets use repository-relative paths', async ({ page }) => {
    await page.goto('/index.html');
    const src = await page.locator('img[alt="Midas SOC Logo"]').first().getAttribute('src');
    expect(src.startsWith('images/')).toBeTruthy();
  });

  test('TC-NAV-09 (FND-009) Shared header/footer component files are servable and valid', async ({ request }) => {
    for (const file of ['components/header.html', 'components/footer.html', 'js/components.js']) {
      const res = await request.get('/' + file);
      expect(res.status()).toBe(200);
      const body = await res.text();
      expect(body.length).toBeGreaterThan(100);
    }
  });

  test('TC-NAV-10 (FND-010) Topic links are repository-relative (no hard-coded origin)', async ({ page }) => {
    await page.goto('/index.html');
    const hrefs = await page.locator('.nav-dropdown a.dropdown-link').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    for (const h of hrefs) {
      expect(h).not.toMatch(/^https?:\/\//);
      expect(h).not.toMatch(/^\/\//);
    }
  });

  test('TC-NAV-11 (FND-011) Dropdown is operable by keyboard (focus + Enter)', async ({ page }) => {
    await page.goto('/index.html');
    const topics = page.locator('.nav-item').filter({ hasText: 'Topics' });
    const btn = topics.getByRole('button');
    await btn.focus();
    await page.keyboard.press('Enter');
    await expect(topics.locator('.nav-dropdown')).toBeVisible();
  });

  test('TC-NAV-12 (FND-012) No horizontal overflow at mobile width', async ({ page }) => {
    test.fail(); // FND-012 defect: .nav-links-left is not collapsed/wrapped at 360px (scrollWidth ~1075)
    await page.setViewportSize({ width: 360, height: 800 });
    for (const path of ['/index.html', '/account-password-security.html', '/remote-wifi-security.html']) {
      await page.goto(path);
      expect(await noHorizontalOverflow(page)).toBeTruthy();
    }
  });
});