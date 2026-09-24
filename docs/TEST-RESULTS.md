# SRS Verification Test Results

**Date:** 2026-09-23
**Suite:** Playwright (Chromium) — see [`../Tests/playwright.config.mjs`](../Tests/playwright.config.mjs)
**Run command:** `npx playwright test` (from `Tests/`)
**Result:** **105 / 105 passed** (55s, 4 workers) — of which 8 are intentional `test.fail()` markers documenting known gaps/defects (see [Defects & Gaps](#defects--gaps)).

## Per-module status (requirement → Test Cases → Result)

| Module | Requirements | Result |
|---|---|---|
| FND (Global UI) | FND-001…FND-011 → TC-NAV-01..11 | **PASS** |
|  | FND-012 → TC-NAV-12 (mobile nav overflow) | **FAIL** (defect, new) |
|  | FND-003 outside-click → TC-NAV-03b | **FAIL** (G-06) |
| FID (Home Portal) | FID-001, FID-003…FID-007, FID-009 → TC-PORTAL-01/03-07/09 | **PASS** |
|  | FID-002 → TC-PORTAL-02 (hero stats) | **FAIL** (G-02) |
|  | FID-008 → TC-PORTAL-08 (dead anchors) | **FAIL** (G-03) |
| FPA (Account) | FPA-001 tabs → TC-PASS-01 | **PASS** |
|  | FPA-001 hash deep-link → TC-PASS-01b | **FAIL** (G-08; requirement partial) |
|  | FPA-002…FPA-009 → TC-PASS-02..09 | **PASS** |
|  | FPA-010 → TC-PASS-10 (favorites JS error) | **FAIL** (G-01) |
| FAI (AI) | FAI-001…FAI-010 → TC-AI-01..10 | **PASS** |
| FDS (Device) | FDS-001…FDS-006 → TC-DEV-01..06 | **PASS** |
| FES (Email) | FES-001…FES-008 → TC-EMAIL-01..08 | **PASS** |
| FHS (Physical) | FHS-001…FHS-004 → TC-PHYS-01..04 | **PASS** |
| FRS (Remote) | FRS-001…FRS-006 → TC-REMOTE-01..06 | **PASS** |
| FXR (External) | FXR-001…FXR-009 → TC-EXT-01..09 | **PASS** |
| FPC (Police) | FPC-001…FPC-005 → TC-POLICE-01..05 | **PASS** |
| FFA (FAQ) | FFA-001…FFA-006, FFA-008 → TC-FAQ-01..06, 08 | **PASS** |
|  | FFA-007 → TC-FAQ-07 ("Ask the SOC") | **FAIL** (G-04) |
| FST (Tips) | FST-001…FST-007 → TC-TIPS-01..07 | **PASS** |
| FEM (Embeds) | FEM-001 render/resize → TC-EMBED-01; FEM-002…FEM-006 | **PASS** |
|  | FEM-001 CTA link → TC-EMBED-07 | **FAIL** (defect, new; requirement partial) |
| NFR | NFR-SEC-001 (k-anonymity, no leakage/storage) → within TC-PASS-05 | **PASS** |

**Summary:** 36/38 requirement groups fully pass; 2 are partial (FPA-001, FEM-001); 6 are failed for known SRS gaps; 2 are failed for newly identified defects.

## Defects & Gaps

Known SRS gaps (G-list) — verified as expected-failures:

| Gap | Test | Detail |
|---|---|---|
| G-01 | TC-PASS-10 (FPA-010) | `toggleFavorite()` unguarded → `ReferenceError` on account page favorites click |
| G-02 | TC-PORTAL-02 (FID-002) | Hero states 12 topics / 7 live modules; grid holds 15 cards / 9 live |
| G-03 | TC-PORTAL-08 (FID-008) | `#policies` / `#news` in-page anchors absent |
| G-04 | TC-FAQ-07 (FFA-007) | "Ask the SOC" control is dead CSS only |
| G-06 | TC-NAV-03b (FND-003) | No outside-click close for dropdowns |
| G-08 | TC-PASS-01b (FPA-001) | No `#tab-*` hash deep-link on load |

New defects identified by this verification run:

| Test | Requirement | Detail |
|---|---|---|
| TC-NAV-12 | FND-012 | Header nav not collapsed/wrapped at 360 px — `.nav-links-left` extends to ~760–800 px; `scrollWidth` ≈ 1075 vs 360 viewport on index/account-password/remote pages |
| TC-EMBED-07 | FEM-001 | `embeds/sharepoint-embed-external-reporting.html` renders widget + posts resize `postMessage`, but ships **no** external-incident CTA link to `external-incident-reporting.html` (html-only variant has one) |

Recommendation: fix the two new defects above; otherwise the current implementation satisfies the requirement set outside of the known G-gaps.

## Test artifacts

- Spec files + infrastructure: `Tests/` (`package.json`, `server.js`, `playwright.config.mjs`, `tc-*.spec.js` per module, `helpers.js`).
- HTML report (last run): `Tests/playwright-report/` (open `index.html`).
- Failure artifacts (if any): `Tests/test-results/`.