const { test, expect } = require('@playwright/test');
const crypto = require('crypto');

const MODULE = 'FPA';

async function openTab(page, label) {
  await page.locator('.tab-btn').filter({ hasText: label }).click();
}

test.describe(`TC-PASS · ${MODULE} Account & Password Security`, () => {

  test('TC-PASS-01 (FPA-001) Four tabs switch and default is steps', async ({ page }) => {
    await page.goto('/account-password-security.html');
    await expect(page.locator('#tab-steps')).toBeVisible();
    await expect(page.locator('#tab-evaluator')).toBeHidden();

    await openTab(page, 'Passphrase Evaluator');
    await expect(page.locator('#tab-evaluator')).toBeVisible();
    await expect(page.locator('#tab-steps')).toBeHidden();

    await openTab(page, 'Security Readiness Checklist');
    await expect(page.locator('#tab-checklist')).toBeVisible();

    await openTab(page, 'Quick Security Checkup');
    await expect(page.locator('#tab-checkup')).toBeVisible();
  });

  test('TC-PASS-01b (FPA-001) URL hash #tab-checklist selects the tab on load', async ({ page }) => {
    test.fail(); // G-08: no load-time hash handling for #tab-* on this page
    await page.goto('/account-password-security.html#tab-checklist');
    await expect(page.locator('#tab-checklist')).toBeVisible();
  });

  test('TC-PASS-02 (FPA-002) Hero shows the looping password video', async ({ page }) => {
    await page.goto('/account-password-security.html');
    const video = page.locator('video.hero-loop-video').first();
    await expect(video).toBeVisible();
    const srcs = await video.locator('source').evaluateAll((s) => s.map((x) => x.getAttribute('src')));
    expect(srcs.join(' ')).toContain('Hero Vid -password sec.mp4');
    await expect(video).toHaveAttribute('autoplay', '');
    await expect(video).toHaveAttribute('loop', '');
  });

  test('TC-PASS-03 (FPA-003) Nine step cards present with required rules', async ({ page }) => {
    await page.goto('/account-password-security.html');
    await expect(page.locator('.step-card')).toHaveCount(9);
    const text = await page.locator('#tab-steps').innerText();
    expect(text).toContain('passphrase');
    expect(text).toContain('MFA');
    expect(text).toMatch(/password manager/i);
    expect(text).toContain('Windows + L');
    expect(text).toContain('phishing');
  });

  test('TC-PASS-04 (FPA-004) Passphrase evaluator scoring bands', async ({ page }) => {
    await page.goto('/account-password-security.html');
    await openTab(page, 'Passphrase Evaluator');

    // Weak: 8 chars, single case, no numbers/symbols -> score 20 -> red 25%
    await page.locator('#passInput').fill('abcdefgh');
    await expect(page.locator('#strengthText')).toContainText('Weak');
    expect(await page.locator('#meterBar').evaluate((el) => parseFloat(el.style.width))).toBeCloseTo(25, 1);
    await expect(page.locator('#crackTime')).toContainText('Few minutes');
    await expect(page.locator('#charCount')).toContainText('8 characters');
    await expect(page.locator('#hasCases')).toContainText('Needs both upper & lower');
    await expect(page.locator('#hasSymbols')).toContainText('Add numbers or symbols');

    // Strong: uppercase+lowercase+symbols+>=16 chars -> score 100 -> green 100%
    await page.locator('#passInput').fill('Coffee#Laptop!Sunset9');
    await expect(page.locator('#strengthText')).toContainText('Strong & Secure!');
    expect(await page.locator('#meterBar').evaluate((el) => parseFloat(el.style.width))).toBeCloseTo(100, 1);
    await expect(page.locator('#crackTime')).toContainText('Centuries');
    await expect(page.locator('#hasCases')).toContainText('Yes');
    await expect(page.locator('#hasSymbols')).toContainText('Yes');

    // Empty resets the meter
    await page.locator('#passInput').fill('');
    await expect(page.locator('#charCount')).toContainText('0 characters');
    expect(await page.locator('#meterBar').evaluate((el) => parseFloat(el.style.width))).toBe(0);
  });

  test('TC-PASS-05 (FPA-005 + NFR-SEC-001) HIBP check is k-anonymous; passphrase never leaves', async ({ page }) => {
    const pass = 'Coffee#Laptop!Sunset9';
    const hash = crypto.createHash('sha1').update(pass).digest('hex').toUpperCase();
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
    const requests = [];

    let hitUrl = '';
    await page.route('**/api.pwnedpasswords.com/range/**', async (route) => {
      hitUrl = route.request().url();
      // serve a matching suffix so the "EXPOSED" branch triggers
      await route.fulfill({ body: `${suffix}:42` });
    });
    page.on('request', (r) => requests.push(r));

    await page.goto('/account-password-security.html');
    await openTab(page, 'Passphrase Evaluator');
    await page.locator('#passInput').fill(pass);

    await expect(page.locator('#breachStatus')).toContainText('EXPOSED', { timeout: 10000 });
    await expect(page.locator('#breachStatus')).toContainText('42');

    // Only the 5-char prefix is sent
    expect(new URL(hitUrl).pathname.toUpperCase()).toContain('/RANGE/' + prefix);
    expect(hitUrl.toUpperCase()).not.toContain(suffix);

    // The full passphrase must never appear in any request URL or body
    for (const r of requests) {
      expect(r.url()).not.toContain(pass);
      if (r.postData()) expect(r.postData()).not.toContain(pass);
    }

    // No client-side persistence of the password
    const snap = await page.evaluate(() => ({ ls: { ...localStorage }, ss: { ...sessionStorage }, cookie: document.cookie }));
    expect(snap.ls).toEqual({});
    expect(snap.ss).toEqual({});
    expect(snap.cookie).toBe('');
  });

  test('TC-PASS-05b (FPA-005) HIBP safe and offline branches', async ({ page }) => {
    await page.goto('/account-password-security.html');
    await openTab(page, 'Passphrase Evaluator');

    // SAFE: no matching suffix in the response
    await page.route('**/api.pwnedpasswords.com/range/**', (route) => route.fulfill({ body: 'ZZZZZ:1\n' }));
    await page.locator('#passInput').fill('CorrectHorse!Battery9');
    await expect(page.locator('#breachStatus')).toContainText('Safe', { timeout: 10000 });

    // OFFLINE: request aborts -> visible failure message
    await page.unroute('**/api.pwnedpasswords.com/range/**');
    await page.route('**/api.pwnedpasswords.com/range/**', (route) => route.abort());
    await page.locator('#passInput').fill('AnotherPassphrase!22');
    await expect(page.locator('#breachStatus')).toContainText('Unable to check', { timeout: 10000 });
  });

  test('TC-PASS-06 (FPA-006) Privacy note explains k-anonymity', async ({ page }) => {
    await page.goto('/account-password-security.html');
    await openTab(page, 'Passphrase Evaluator');
    const note = await page.locator('.breach-privacy-note').innerText();
    expect(note).toMatch(/k-?anonymity/i);
    expect(note).toMatch(/prefix/i);
  });

  test('TC-PASS-07 (FPA-007) Readiness checklist scores correctly', async ({ page }) => {
    await page.goto('/account-password-security.html');
    await openTab(page, 'Security Readiness Checklist');
    const boxes = page.locator('.audit-check');

    await expect(page.locator('#scoreValue')).toContainText('0%');
    await expect(page.locator('#scoreStatus')).toContainText('Complete all 7 items');

    for (let i = 0; i < 4; i++) await boxes.nth(i).check();
    await expect(page.locator('#scoreValue')).toContainText('57%');
    await expect(page.locator('#scoreStatus')).toContainText('Good progress');

    for (let i = 4; i < 7; i++) await boxes.nth(i).check();
    await expect(page.locator('#scoreValue')).toContainText('100%');
    await expect(page.locator('#scoreStatus')).toContainText('Excellent');
  });

  test('TC-PASS-08 (FPA-008) Quick Security Checkup links outward safely', async ({ page }) => {
    await page.goto('/account-password-security.html');
    await openTab(page, 'Quick Security Checkup');
    const google = page.locator('#tab-checkup a[href="https://myaccount.google.com/security-checkup"]');
    const microsoft = page.locator('#tab-checkup a[href="https://mysignins.microsoft.com/security-info"]');
    await expect(google).toBeVisible();
    await expect(google).toHaveAttribute('target', '_blank');
    await expect(google).toHaveAttribute('rel', /noopener/);
    await expect(microsoft).toBeVisible();
    await expect(microsoft).toHaveAttribute('target', '_blank');
    await expect(microsoft).toHaveAttribute('rel', /noopener/);
  });

  test('TC-PASS-09 (FPA-009) Copy 9-step guidelines to clipboard', async ({ context, page }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://localhost:8080' });
    page.on('dialog', (d) => d.accept());
    await page.goto('/account-password-security.html');
    await page.evaluate(() => copyGuidelines());
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toContain('9-Step Checklist');
    expect(clip).toContain('Multi-Factor Authentication');
    expect(clip).toContain('Win + L');
  });

  test('TC-PASS-10 (FPA-010) Favorites click must not throw a JS error', async ({ page }) => {
    test.fail(); // G-01: unguarded toggleFavorite() -> ReferenceError on this page
    const errors = attachErrorCaptureCore(page);
    await page.goto('/account-password-security.html');
    await page.locator('.nav-action-btn').first().click();
    expect(errors).toEqual([]);
  });
});

function attachErrorCaptureCore(page) {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}