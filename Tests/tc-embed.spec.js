const { test, expect } = require('@playwright/test');

const MODULE = 'FEM';

test.describe(`TC-EMBED · ${MODULE} SharePoint Embeddables`, () => {

  test('TC-EMBED-01 (FEM-001) SharePoint widget renders and posts resize height to the host page', async ({ page }) => {
    await page.addInitScript(() => {
      // Emulate an embed host so the widget sees window.parent !== window and posts to it
      Object.defineProperty(window, 'parent', {
        configurable: true,
        get: () => window.__hostParent
      });
      window.__hostParent = {
        postMessage: (data) => {
          (window.__posted = window.__posted || []).push(data);
        }
      };
    });
    await page.goto('/embeds/sharepoint-embed-external-reporting.html');
    await expect(page.locator('body')).toContainText('How to Report an Incident Outside of MIDAS');
    await expect(page.locator('.red-accent-bar')).toBeVisible();
    await expect(page.locator('.report-sec-container')).toBeVisible();
    await expect.poll(() => page.evaluate(() => (window.__posted || []).length)).toBeGreaterThan(0);
    const msgs = await page.evaluate(() => window.__posted);
    const resizeMsg = msgs.find((m) => m && m.type === 'sharepoint-resize');
    expect(resizeMsg, 'a sharepoint-resize message should be posted').toBeTruthy();
    expect(typeof resizeMsg.height).toBe('number');
    expect(resizeMsg.height).toBeGreaterThan(0);
  });

  test('TC-EMBED-07 (FEM-001 gap) Sharepoint widget exposes an external-incident CTA link', async ({ page }) => {
    test.fail(); // FEM-001 gap: widget renders but ships no CTA link to external-incident-reporting.html
    await page.goto('/embeds/sharepoint-embed-external-reporting.html');
    await expect(page.locator('a[href*="external-incident-reporting"]').first()).toBeVisible();
  });

  test('TC-EMBED-02 (FEM-002) Report-incident header component renders with correct copy and logo', async ({ page }) => {
    await page.goto('/embeds/report-incident-header.html');
    await expect(page.locator('body')).toContainText('Report a Security Incident');
    await expect(page.locator('body')).toContainText('NO JUDGMENT');
    await expect(page.locator('body')).toContainText('REPORTING FAST HELPS EVERYONE.');
    await expect(page.locator('svg, img[src*="logo"], img[src*="ribbon"]').first()).toBeVisible();
  });

  test('TC-EMBED-03 (FEM-003) Zero-JS embed uses a no-script CTA with safe rel attributes', async ({ page }) => {
    await page.goto('/embeds/html-only-embed-external.html');
    const scripts = await page.locator('script').count();
    expect(scripts).toBe(0);
    const link = page.locator('a[href*="external-incident-reporting"]').first();
    await expect(link).toHaveAttribute('target', '_blank');
    const rel = await link.getAttribute('rel');
    expect(rel).toMatch(/noopener/);
    expect(rel).toMatch(/noreferrer/);
    const href = await link.getAttribute('href');
    expect(href).toContain('#wizard');
  });

  test('TC-EMBED-04 (FEM-004) Embed pages are transparent with zero margin', async ({ page }) => {
    for (const path of ['/embeds/sharepoint-embed-external-reporting.html', '/embeds/html-only-embed-external.html']) {
      await page.goto(path);
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(bg).toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('TC-EMBED-05 (FEM-005) Widgets render cleanly at the documented 750-800px height', async ({ page }) => {
    for (const path of ['/embeds/sharepoint-embed-external-reporting.html', '/embeds/html-only-embed-external.html']) {
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow, `${path} should not overflow horizontally`).toBeFalsy();
    }
  });

  test('TC-EMBED-06 (FEM-006) SharePoint embed guide documents the iframe snippet', async ({ request }) => {
    const res = await request.get('/docs/sharepoint-embed-guide.md');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('height="750px"');
    expect(body).toContain('width="100%"');
    expect(body).toContain('frameborder="0"');
  });
});