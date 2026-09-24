# Security Assessment — Midas Cyber Awareness & Security Hub

**Date:** 2026-09-24
**Scope:** Entire repository — 13 root HTML pages, `embeds/`, `components/`, `js/components.js`, `docs/`, `Tests/` (test server + Playwright), `archives/`, git metadata, dependencies.
**Method:** Static code review of client-side JS/HTML/CSS (DOM-sink analysis, source/sink tracing), external-surface inventory, secret-scan, HTTP behavior test of the included dev server, and `npm audit` on the dependency set. Deliberately excluded from automated scanning: `node_modules/`, `Tests/playwright-report`, `Tests/test-results`.
**Deployment context:** Static site (GitHub Pages / SharePoint Embed), no backend, no build step. Network egress is limited to Google Fonts, HIBP range API, XposedOrNot API, `flagcdn.com`, SharePoint tenant, and user mail/dial clients.

---

## Executive summary

No exploitable client-side injection (DOM XSS), no hardcoded API keys / private keys / cloud credentials / database connection strings, no `eval` / `document.write` / `new Function`, no dynamic navigation sinks, no inbound `postMessage` handling, and **0 known vulnerabilities across all npm dependencies** were found. The password-checker correctly implements k-anonymity (only the SHA-1 prefix leaves the browser — verified at `account-password-security.html:1929`), and no security-sensitive data is persisted (`localStorage`/`sessionStorage`/`cookie` are unused in application code).

The residual issues are hardening items and data-governance items rather than exploitable vulnerabilities. The three items rated **Medium** are: (1) a SharePoint Stream share-code embedded in a committed HTML URL, (2) transmission of the full email address to the third party XposedOrNot with no explicit privacy disclosure, and (3) an outbound `postMessage` using the `'*'` target origin (previously documented as gap G-10 in the SRS).

**Overall residual risk: LOW** for the deployed static site. **LOW** for the test infrastructure when bound to localhost only; it must not be exposed to a network without fixing the dotfile/directory exposure (Section 4.1).

---

## Findings summary

| # | Severity | Finding | Location |
|---|---|---|---|
| M1 | **Medium** | SharePoint Stream share-code token (`?e=fD36HO`) in committed HTML | `ai-sensitive-information.html:1754, 1778` |
| M2 | **Medium** | Full email sent to XposedOrNot without k-anonymity / user disclosure | `email-security.html:2590` |
| M3 | **Medium** | Outbound `postMessage` with wildcard target origin (`'*'`) — SRS gap G-10 | `embeds/sharepoint-embed-external-reporting.html:326-329` |
| L1 | **Low** | Dev/test server serves `.git`, dotfiles, `node_modules`, `Tests/`, archives over HTTP | `Tests/server.js:37-64` |
| L2 | **Low** | Real personal Gmail hardcoded as a test vector in shipped page | `email-security.html:2534` |
| L3 | **Low** | `innerHTML` fed from in-file data arrays (author-controlled today → XSS sink if ever made dynamic) | see §3.3 |
| L4 | **Low** | No Content-Security-Policy / nosniff / frame-ancestors on served pages | server + deployed host |
| L5 | **Low** | Local absolute path leaks OS username in committed SRS | `docs/SRS-Midas-Cyber-Awareness-Security-Hub.md:11, 96` |
| L6 | **Low** | Absolute GitHub Pages CTA URL hardcoded in embed (host-agnosticity) | `embeds/html-only-embed-external.html:221` |
| I1 | Info | Fictional demo credential `Summer2026!` in packet simulator | `remote-wifi-security.html:1964, 2335` |
| I2 | Info | RFC1918 IP shown in simulator output | `remote-wifi-security.html:1972, 2343` |
| I3 | Info | Full-project snapshot `archives/Embed.rar` present but untracked | `archives/Embed.rar` |
| I4 | Info | Git remote URL embeds GitHub username (no password/token) | `.git/config` |
| I5 | Info | Google Fonts dependency (supply-chain / availability) | all pages `<head>` |
| I6 | Info | Phishing demo renders a suspicious-looking `https://microsoft-security.com/...` hover link (intentional teaching aid) | `email-security.html:1966` |

---

## 1. Attack surface inventory

### 1.1 Third-party / network egress points
| Endpoint | Use | TLS | Notes |
|---|---|---|---|
| `fonts.googleapis.com`, `fonts.gstatic.com` | Font loading (all pages) | HTTPS | keyless; supply-chain (I5) |
| `api.pwnedpasswords.com/range/{prefix}` | Password breach check | HTTPS | k-anonymity prefix only — **verified** |
| `api.xposedornot.com/v1/check-email/{email}` | Email breach check | HTTPS | full email sent (M2) |
| `haveibeenpwned.com/account/{email}` | Outbound details link | HTTPS | `encodeURIComponent`-safe |
| `flagcdn.com/lk.svg|bd.svg|pk.svg` | Country flags | HTTPS | availability + tamper (G-14) |
| `midassafety.sharepoint.com` (hub, video, policy PDF) | Tenant content / embeds | HTTPS | share-code token (M1) |
| `telligp.police.lk`, `cirt.gov.bd`, `nccia.gov.pk`, `myaccount.google.com`, `mysignins.microsoft.com` | Official portals / checkups | HTTPS | `target="_blank" rel="noopener"` |
| `mailto:`, `tel:` | SOC + national hotlines | n/a | intentional channels |

All external URLs use HTTPS. No plaintext-HTTP endpoints exist (all `http://` occurrences are the `xmlns="http://www.w3.org/2000/svg"` SVG namespace).

### 1.2 Trust boundaries lacking
- **No server** behind the site (static hosting) → no server-side auth, injection, or SSRF surface.
- **No inbound `postMessage` handlers** anywhere → no message-based XSS surface.
- **No `localStorage` / `sessionStorage` / `document.cookie`** writes in application code → no persisted-sensitive-data risk (verified; the only occurrence is in a test spec reading them to assert emptiness).

---

## 2. Client-side injection analysis (DOM XSS)

**Result: no exploitable DOM XSS found.**

### 2.1 Sinks verified SAFE
- **Remote API data (HIBP range):** only the numeric `count` is rendered (`account-password-security.html:1956`); no remote text reaches HTML.
- **Remote API data (XposedOrNot):** breach names pass through `escapeHtml()` (`email-security.html:2562, 2602`; helper at `:2660`, escapes `& < > " '`), list is `.slice(0,16)`-bounded.
- **User email** rendered only via `escapeHtml(email)` (`:2556`) or in hrefs via `encodeURIComponent(email)` (`:2552`, `:2580`, `:2623`, `:2639`, `:2652`).
- **Inline handlers (~90):** all pass hard-coded literals only (e.g., `selectScenario(3)`, `selectFlag(1)`, `openArticle(12)`); none concatenate data. `oninput`/`onkeyup` filters only read `.value` for `includes()/style` filtering.
- **Hash routing** (`remote-wifi-security.html:2423`): value compared against fixed constants only.

### 2.2 Sinks that are SAFE today but are "pattern risks" (L3)
`innerHTML` populated from hard-coded, author-controlled arrays. If any of these arrays ever become remotely sourced, each becomes an immediate DOM-XSS sink with no escaping layer:

1. `external-incident-reporting.html:1817-1818` — `wizResTitle.innerHTML = data.title; wizResBody.innerHTML = data.body` (from `scenarioData`, which intentionally contains `<strong>`/`<br>`). **Nearest miss.**
2. `ai-sensitive-information.html:2588-2594` — classification card from `classificationData`.
3. `ai-sensitive-information.html:2716-2736` — principle detail from `principleData` (`keyTakeaways` mapped unescaped).
4. `remote-wifi-security.html:2314` — `#simTip` from `simData.tip`.
5. `security-tips.html:1876` — article takeaway from `articlesData`.
6. `js/components.js:13, 26` — `innerHTML` of fetched `components/header.html` / `footer.html` (dormant: no pages currently contain the `#site-header`/`#site-footer` placeholders).

**Recommendation:** centralize an `escapeHtml()` helper and apply it to all template interpolations; or better, migrate to `textContent`/`createElement`. This is defense-in-depth, not an active bug.

### 2.3 Evaluated-and-clean
`eval(`, `new Function`, string-argument `setTimeout`/`setInterval`, `document.write`, `insertAdjacentHTML`, `outerHTML`, `location.href/assign/replace`, `window.open`, `document.URL`/`location.search` parsing: **zero occurrences** in application code. CSS `url(javascript:)`/`expression()`/remote `@import`: zero.

---

## 3. Secrets & sensitive data

**No API keys, private keys, cloud credentials, DB connection strings, Google/Maps/Analytics keys, npm tokens, JWT, or credit-card numbers found.** Notable items:

- **M1 — SharePoint share code in committed HTML.** `ai-sensitive-information.html:1754,1778` embeds `…?e=fD36HO` — a SharePoint sharing token. Anyone with the URL can open that video if the item is "Anyone with the link." **Action:** verify the file's sharing scope is organization/tenant-only; prefer embedding from a non-token URL or server-proxied asset.
- **M2 — Full-email disclosure to XposedOrNot.** The email checker (`email-security.html:2590`) transmits the **entire, unhashed email address** to `api.xposedornot.com`. The k-anonymity guarantee in the SRS (NFR-SEC-001) covers the *password* HIBP check only. The UI states it is "Querying global breach databases (HIBP & XposedOrNot)" but gives no privacy disclosure that the email leaves the browser in plaintext. **Action:** add a disclosure line, or switch to a prefix-based lookup if the service supports one.
- **L2 — Personal Gmail as a test vector (FIXED).** Formerly `'tharinduhero500@gmail.com'` at `email-security.html:2534` (documented in SRS at line 534). **Action Completed:** Replaced with synthetic test vector `'user@example.com'`.
- **L5 — OS username in committed SRS.** `C:\Users\thari\Desktop\Embed` at `docs/SRS-…md:11, 96`. **Action:** use `$REPO_ROOT`.
- **I1/I2 — fictional demo values** (`employee@midas.com / Summer2026!`, `192.168.1.45`): fine; make the demo credential obviously non-real (`user@nowhere.invalid`, TEST-NET IP) to avoid confusion.
- **I3 — `archives/Embed.rar`** (69 KB) is a full snapshot, untracked (gitignored via `*.rar`). **Action:** delete or move out of the working tree; keep gitignored.

---

## 4. Test infrastructure (`Tests/`)

### 4.1 Static file server exposure (L1) — verified by HTTP test
`Tests/server.js` serves the **entire repository root over HTTP**, including:

```
/.git/config        -> 200 (git remote URL + username exposed)
/.gitignore         -> 200
/Tests/package.json -> 200
/archives/Embed.rar -> 200
```
Tested traversal cases: encoded `/%2e%2e/README.md` → **403** (path-traversal guard works). Plain `/../README.md` returning 200 is an artifact of the HTTP client normalizing the path before transmission, not a server bypass.

- **Risk:** while bound to localhost this is benign; it must **never** be bound to a routable interface (`server.listen(PORT)` currently binds `::`/`0.0.0.0`, i.e., all interfaces).
- **Hardening (cheap):** (a) `server.listen(PORT, '127.0.0.1')`; (b) reject dotfiles and non-web assets (`.git`, `node_modules`, `Tests`, `archives`); (c) add `X-Content-Type-Options: nosniff` (`.rar`/`.md` currently serve as `application/octet-stream` / `text/markdown`, so nosniff is the main protection). Dependency risk is near-zero anyway: `npm audit` reports **0 vulnerabilities** (playwright + playwright-core only).

### 4.2 Test data
Fake addresses (`test@example.com`, `pwned@example.com`, `no-breaches@example.com`) and fake responses (intercepted via `page.route`) — no real external calls during test runs. No secrets in tests.

---

## 5. HTTP hardening (deployed site)

- **No Content-Security-Policy.** Static pages rely on inline scripts everywhere, Google Fonts, and two remote APIs. Adding a strict CSP is not feasible without significant refactor (would require `'unsafe-inline'`); at minimum consider a report-only CSP and `img-src` constraints (flagcdn) once fonts are self-hosted.
- **No `X-Content-Type-Options: nosniff`, no `Referrer-Policy`, no HSTS** — these are controlled by the hosting provider (GitHub Pages/SharePoint). GH Pages does not let authors set headers; note this as an accepted platform constraint.
- **Clickjacking/framing:** the hub pages are *meant* to be iframed (SharePoint embeds), so `X-Frame-Options`/`frame-ancestors` must be scoped narrowly rather than denied. No state-changing/sensitive actions exist on these pages, so practical clickjacking impact is low.
- **M3 — `postMessage('*')`** (SRS gap G-10): the SharePoint embed posts `{type:'sharepoint-resize', height}` to `window.parent` with `'*'`. Payload is non-sensitive, but restrict the target origin to the SharePoint tenant (or to `frameElement.src`'s origin). No message *listener* exists, so there is no inbound risk.

---

## 6. What is healthy (verified positives)

- Password checker: k-anonymity prefix-only egress; full passphrase never sent, logged, or stored (test `TC-PASS-05`/NFR-SEC-001 confirmed network-level suffix absence + empty client storage).
- All external links `https:`; all `target="_blank"` anchors carry `rel="noopener noreferrer"`.
- No storage APIs used; no analytics/tracking scripts; no third-party JS executed (fonts only are stylesheets).
- No dynamic URL building from user input; no `javascript:` URI with dynamic content.
- No secrets/keys anywhere; `npm audit` clean (0/0/0/0/0).
- Explorer traffic in the remote module is purely illustrative SVG/text; the educational phishing sample (`microsoft-security.com` hover link) is static and inert (`href="javascript:void(0)"`) — I6.

---

## 7. Recommendations (prioritized)

1. **M1** — Audit the SharePoint video's sharing scope; remove/replace the `?e=` token or move the asset behind tenant auth or a proxy.
2. **M2** — Disclose (UI) that the full email is sent to XposedOrNot, or switch to an email-hash/prefix lookup; delete the hard-coded Gmail vector (L2) at the same time.
3. **M3** — Replace `postMessage('*')` with an explicit SharePoint origin; this resolves SRS G-10 / NFR-SEC-008.
4. **L1** — Harden the test server: bind `127.0.0.1`, deny dotfiles/`.git`/`node_modules`/`archives`/`Tests`, add `nosniff`.
5. **L3** — Introduce a shared `escapeHtml()` and apply it in the 6 template sinks; future-proof for any CMS-driven content.
6. **L5, I1–I3** — Scrub personal/sample artifacts (SRS path, demo password, `Embed.rar`).
7. **L4/I5** — Evaluate self-hosting fonts for supply-chain and CSP benefits.

---

## Appendix A — Files analyzed
`index.html`, `account-password-security.html`, `ai-sensitive-information.html`, `device-security.html`, `email-security.html`, `external-incident-reporting.html`, `faq.html`, `physical-security.html`, `police-cyber-crime-advisory.html`, `remote-wifi-security.html`, `security-tips.html`, `embeds/*.html` (3), `components/*.html` (2), `js/components.js`, `Tests/server.js`, `Tests/*.spec.js`, `Tests/package.json`.

## Appendix B — Known-gap cross-reference (SRS G-list)
G-09 duplicate video sources (availability, not security), G-10 `postMessage('*')` (M3, previously documented), G-14 external `flagcdn.com` (availability/spoof — I5 category). No new security gaps beyond those classified in this report.