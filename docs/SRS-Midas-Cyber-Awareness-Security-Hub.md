# Software Requirements Specification (SRS)

## Midas Cyber Awareness & Security Hub

| Attribute | Value |
|---|---|
| **Document Version** | 1.0 |
| **Date** | September 2026 |
| **Status** | Draft for Review |
| **Prepared By** | Security Engineering / Web Development Team |
| **Project Repository** | `C:\Users\thari\Desktop\Embed` |
| **Compliance Reference** | IEEE 830 / ISO/IEC/IEEE 29148 (soft) |

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 Purpose
   - 1.2 Scope
   - 1.3 Product Overview
   - 1.4 Definitions, Acronyms, and Abbreviations
   - 1.5 References
   - 1.6 Document Conventions
2. [Overall Description](#2-overall-description)
   - 2.1 Product Perspective
   - 2.2 Product Functions
   - 2.3 User Classes and Characteristics
   - 2.4 Operating Environment
   - 2.5 Design and Implementation Constraints
   - 2.6 User Documentation
   - 2.7 Assumptions and Dependencies
3. [System Architecture Overview](#3-system-architecture-overview)
   - 3.1 Technology Stack
   - 3.2 Page Inventory
   - 3.3 Directory Structure
   - 3.4 Shared Component Infrastructure
   - 3.5 External Interfaces
4. [Functional Requirements](#4-functional-requirements)
   - 4.1 Site-Wide Global Navigation & Shared UI (FND)
   - 4.2 Home Portal Directory — `index.html` (FID)
   - 4.3 Account & Password Security — `account-password-security.html` (FPA)
   - 4.4 AI & Sensitive Information Policy — `ai-sensitive-information.html` (FAI)
   - 4.5 Device Security — `device-security.html` (FDS)
   - 4.6 Email Security & Phishing Spotter — `email-security.html` (FES)
   - 4.7 Physical & Social Engineering Security — `physical-security.html` (FHS)
   - 4.8 Remote & Wi-Fi Security — `remote-wifi-security.html` (FRS)
   - 4.9 External Incident Reporting — `external-incident-reporting.html` (FXR)
   - 4.10 Police Cyber Crime Advisory — `police-cyber-crime-advisory.html` (FPC)
   - 4.11 FAQ / Help Center — `faq.html` (FFA)
   - 4.12 Security Tips Library — `security-tips.html` (FST)
   - 4.13 SharePoint Embed Components — `/embeds` (FEM)
   - 4.14 Feature Interaction Matrix
5. [External Interface Requirements](#5-external-interface-requirements)
   - 5.1 User Interface
   - 5.2 Hardware Interfaces
   - 5.3 Software Interfaces
   - 5.4 Communications Interfaces
   - 5.5 Data Flows
6. [Non-Functional Requirements](#6-non-functional-requirements)
   - 6.1 Performance Requirements
   - 6.2 Security & Privacy Requirements
   - 6.3 Reliability & Availability
   - 6.4 Usability & Accessibility
   - 6.5 Maintainability & Portability
   - 6.6 Compliance & Legal
7. [Known Gaps, Defects, and Future Enhancements](#7-known-gaps-defects-and-future-enhancements)
8. [Verification & Validation](#8-verification--validation)
   - 8.1 Verification Matrix (Traceability)
   - 8.2 Test Approach
9. [Appendix](#9-appendix)
   - A. Content Rule Inventory per Module
   - B. Contact & Escalation Channel Inventory
   - C. External URLs & APIs

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for the **Midas Cyber Awareness & Security Hub** — a static, serverless web application that educates Midas Safety employees on cybersecurity, data-protection, and physical-security best practices, and provides guided channels for reporting security incidents.

The document is intended for:

- **Developers** responsible for building, maintaining, and extending the site.
- **Security Operations Center (SOC)** and **Information Security** staff who own content accuracy and incident-reporting channels.
- **Content authors** who maintain security-awareness educational content.
- **Quality Assurance** teams who verify and test system behavior.
- **Stakeholders and management** who review scope and approval criteria.

This SRS is based on a deep, end-to-end source-code analysis of every page, script, style, asset, and documentation file in the repository. Requirements are derived from observed implemented behavior; where the analysis found an implemented-but-broken or incomplete feature, it is recorded in [Section 7 (Known Gaps)](#7-known-gaps-defects-and-future-enhancements) rather than silently assumed.

### 1.2 Scope

The product covered by this SRS is the full set of deliverables within the repository root `C:\Users\thari\Desktop\Embed`:

| Deliverable | Description |
|---|---|
| 11 static web pages (`.html`) | Home portal, 6 security-topic training modules, external incident reporting, police advisory, FAQ, and security-tips library |
| 3 SharePoint embed components (`/embeds`) | Self-contained embeddable widgets for Microsoft SharePoint Modern Pages |
| Shared header / footer components (`/components`) | Reusable site chrome loaded via JavaScript |
| Shared component loader (`/js/components.js`) | Client-side loader that injects header/footer HTML |
| Media & brand assets (`/images`, `/video`) | SOC logo, hero backgrounds, post images, and hero-loop videos |
| Documentation (`/docs`) | AI policy, hosting guides, and SharePoint embed guides (references for content) |
| Archived package (`/archives/Embed.rar`) | Versioned archive of the source set |

**In scope:** All user-visible functionality, all client-side business logic (password scoring, breach lookups, classification rules, filters, tabs, simulators, checklists, search), all external interface behavior (`mailto:`, `tel:`, third-party APIs, SharePoint), visual/UX consistency, and non-functional characteristics.

**Out of scope:** Backend services, databases, user authentication/authorization (identity is handled by SharePoint), analytics, server-side rendering, and third-party system behavior beyond the documented public APIs used.

### 1.3 Product Overview

The Midas Cyber Awareness & Security Hub is a **100% static, zero-dependency client-side** website designed to run directly from static web hosting (Microsoft SharePoint, Netlify, or GitHub Pages). It delivers employee security training through:

- A **portal directory** homepage listing all learning modules, tools, and news links.
- Six **interactive training modules**: Account & Password Security; AI & Sensitive Information; Device Security; Email Security & Phishing; Physical & Social Engineering Security; and Remote & Wi-Fi Security.
- **Official external incident-reporting** guidance for South Asia (Sri Lanka, Bangladesh, Pakistan), including an incident decision wizard and emergency channels.
- A Sri Lanka **Police Cyber Crime advisory** page (CID/CCID), bilingual English/Sinhala.
- A searchable **FAQ/Help Center** and a filterable **Security Tips library**.
- **SharePoint-embeddable widgets** that can be dropped into intranet pages.

All interactivity is implemented in inline vanilla JavaScript. No user data is persisted on the client or transmitted to a Midas-owned backend. The only network egress points are two breach-lookup web APIs (HIBP range API and XposedOrNot) and the user's own email/Tel clients through `mailto:` / `tel:` links.

### 1.4 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|---|---|
| **AI** | Artificial Intelligence |
| **BD** | Bangladesh (country code) |
| **CCID** | Computer Crime Investigation Division (Sri Lanka Police) |
| **CERT** | Computer Emergency Response Team |
| **CID** | Criminal Investigation Department (Sri Lanka Police) |
| **CIRT** | Computer Incident Response Team |
| **HIBP** | Have I Been Pwned (`api.pwnedpasswords.com`) |
| **IT** / **InfoSec** | Information Technology / Information Security team |
| **LK** | Sri Lanka (country code) |
| **MFA** | Multi-Factor Authentication |
| **MITM** | Man-In-The-Middle (attack) |
| **NCCIA** | National Cyber Crime Investigation Agency (Pakistan) |
| **OS** | Operating System |
| **PK** | Pakistan (country code) |
| **PTA** | Pakistan Telecommunication Authority |
| **rem** | Relative CSS font-size unit (root em) |
| **SOC** | Security Operations Center |
| **SOP** | Standard Operating Procedure |
| **SRS** | Software Requirements Specification |
| **SSID** | Service Set Identifier (Wi-Fi network name) |
| **VPN** | Virtual Private Network |
| **WPA/WPA2/WPA3** | Wi-Fi Protected Access protocol generations |

### 1.5 References

| Reference | Location |
|---|---|
| Midas Safety AI Policy v1.0 | `docs/Midas Safety AI Policy_v1.md`; SharePoint PDF: `https://midassafety.sharepoint.com/sites/Intranet/PolicyDocuments/Midas%20Safety%20AI%20Policy_v1.pdf` |
| Hosting & SharePoint Button Guide | `docs/hosting-and-sharepoint-button-guide.md` |
| SharePoint Embed Guide | `docs/sharepoint-embed-guide.md` |
| Project README | `README.md` |
| Have I Been Pwned API docs | `https://haveibeenpwned.com/API/v3` |
| XposedOrNot API | `https://api.xposedornot.com` |

### 1.6 Document Conventions

- **Requirement identifiers** follow the pattern `<ModulePrefix>-<NNN>`, e.g., `FPA-014`. Prefixes are defined in [Section 4](#4-functional-requirements). Prefixes ending in `-R` denote "requirements to be refined" or pending-fix requirements.
- Keywords **SHALL**, **SHALL NOT**, **MUST**, **MUST NOT**, **SHOULD**, and **MAY** are used per RFC 2119 semantics.
- Functional Requirements = `FR-` style IDs; Non-Functional = `NFR-` IDs.
- "Current behavior" notes describe observed implementation and are informational, not requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

The Hub is a **component of the broader Midas Safety intranet** hosted on Microsoft SharePoint (`https://midassafety.sharepoint.com/`). Individual pages may be:

1. Served as standalone pages from SharePoint Site Assets / Documents.
2. Embedded into SharePoint Modern Pages via the **Embed Web Part** (with auto-resize `postMessage` bridging).
3. Referenced from SharePoint buttons / Hero / Quick Links web parts as deep links.

The system is successor-agnostic: it must remain serviceable as static files with no build pipeline and no runtime server.

### 2.2 Product Functions (Summary)

The product shall provide:

1. **Central directory & search** over all security-awareness modules.
2. **Interactive training modules** with tabs, accordions, step guides, hotlists, simulators, checklists, and quizzes.
3. **Passphrase strength evaluation** with real-time scoring, brute-force time estimation, and privacy-preserving breach checking (HIBP k-anonymity).
4. **Email breach exposure checking** against third-party breach databases (XposedOrNot).
5. **AI data-classification guidance** mapping user-selected data types to policy-appropriate AI usage rules.
6. **Network security education** via Wi-Fi threat simulation and a VPN encryption visualizer.
7. **Incident escalation guidance** (internal SOC + official external channels for LK/BD/PK), with decision-wizard assistance.
8. **A searchable, filterable FAQ** and **tips library** with article slide-over.
9. **Reusable site chrome** (header/footer) loadable on every page with consistent navigation.
10. **SharePoint-embedded widgets** that auto-resize to their container.

### 2.3 User Classes and Characteristics

| User Class | Description | Primary Needs |
|---|---|---|
| **Employees (General)** | Office, factory/operations, and field staff across LK/BD/PK regions | Training modules, tip library, FAQ, podcast/quiz completion |
| **Remote Workers** | Staff who connect from home or public networks | Remote/Wi-Fi security, VPN guidance, device hardening |
| **Incident Reporters** | Any employee who needs to report a security incident (internal or external) | Fast access to SOC channel and country-specific official channels |
| **SOC / Information Security** | Own content accuracy, receive incident reports at `cic@midassafety.com` | Monitoring the reporting funnel, keeping channels current |
| **Site Administrators / Content Authors** | Maintain pages, policies, and media on SharePoint | Easy static-file updates, embed components for intranet pages |
| **Bilingual (Sinhala) Users** | Primarily Sri Lankan staff | Sinhala-rendered content on police advisory (via `Noto Sans Sinhala`) |

### 2.4 Operating Environment

| Aspect | Requirement |
|---|---|
| **Browsers** | Current stable versions of Chrome, Edge, Firefox, Safari; includes desktop and mobile viewports |
| **JS Feature Requirements** | `fetch`, `crypto.subtle` (Web Crypto), `navigator.clipboard`, `ResizeObserver` (optional embed), `postMessage`, `Promise`/`async` |
| **Fonts** | Loaded from Google Fonts CDN (`Plus Jakarta Sans`, `Noto Sans Sinhala`, `Caveat`) with system fallbacks |
| **Hosting** | Static hosting only — Microsoft SharePoint, Netlify, GitHub Pages; no server-side language required |
| **Network** | Internet required for Google Fonts, HIBP/XposedOrNot APIs, and external SharePoint Stream videos; pages degrade gracefully offline (breach checks fail with a user-visible message) |

### 2.5 Design and Implementation Constraints

- **Static-only:** No server, no build step, no package manager, no Node runtime. Deploy by uploading files.
- **No frameworks or libraries:** Vanilla HTML5 / CSS3 / JavaScript only. No jQuery, no Bootstrap, no bundler.
- **Spotify-like self-containment:** Minimal external runtime dependencies; CDN only for fonts and breach-query APIs.
- **Brand consistency:** Every page SHALL present the Midas SOC dark-navy (`#0f172a`-family) + amber (`#f59e0b`) + blue (`#2563eb`/`#38bdf8`) theme and the tagline "Never Trust. Always Verify."
- **No data persistence:** No `localStorage`, `sessionStorage`, or cookies MAY be introduced without a privacy re-review (see [NFR-SEC](#6.2)).
- **SharePoint compatibility:** Inline `<style>` and `<script>` SHALL remain self-contained so pages render correctly inside the SharePoint Embed Web Part.

### 2.6 User Documentation

| Documentation | Purpose |
|---|---|
| `docs/Midas Safety AI Policy_v1.md` | Source text of the AI policy featured on the AI module |
| `docs/hosting-and-sharepoint-button-guide.md` | Guide for hosting pages and linking via SharePoint buttons |
| `docs/sharepoint-embed-guide.md` | Guide for embedding the account-security element in SharePoint via iframe/srcdoc |
| `README.md` | Repository identity stub |

### 2.7 Assumptions and Dependencies

- All incident-reporting email addresses, hotlines, and regulator channels listed are assumed accurate and subject to periodic SOC review.
- The Midas SOC inbox `cic@midassafety.com` is the canonical internal escalation point.
- The HIBP and XposedOrNot public APIs are assumed available; the UI must handle their unavailability gracefully.
- Video assets are large binary files; pages must reference them with correct relative paths and must not break layout while loading.
- SharePoint is assumed to permit static `.html` hosting and iframe embedding in the intranet tenant.

---

## 3. System Architecture Overview

### 3.1 Technology Stack

- **Markup:** HTML5 semantic elements, inline SVG iconography (no icon fonts).
- **Styling:** CSS3 with custom properties (design tokens), CSS Grid/Flexbox, `@keyframes` animations, responsive `@media` breakpoints.
- **Scripting:** Vanilla JavaScript; inline `<script>` blocks per page.
- **Fonts:** `Plus Jakarta Sans` (all), `Noto Sans Sinhala` (police advisory), `Caveat` (AI widget annotation).
- **External APIs:** HIBP range API (`api.pwnedpasswords.com`), XposedOrNot (`api.xposedornot.com`).
- **Protocols used client-side:** `mailto:`, `tel:`, `https:`, `javascript:` (educational trap only), `postMessage` (embeds).

### 3.2 Page Inventory

| File | Type | Primary Function |
|---|---|---|
| `index.html` | Portal | Landing, module directory, topic search, quick tools |
| `account-password-security.html` | Module | 9-step guide, evaluator, checklist, checkup links |
| `ai-sensitive-information.html` | Module | AI policy, 9-way classifier, 6 principles, red-zone |
| `device-security.html` | Module | Windows/Android/iOS hardening steps |
| `email-security.html` | Module | Phishing spotter mock Outlook, breach checker |
| `physical-security.html` | Module | 7 physical/social-engineering habits |
| `remote-wifi-security.html` | Module | Wi-Fi simulator, VPN visualizer, tips |
| `external-incident-reporting.html` | Module | Country escalation directory LK/BD/PK + wizard |
| `police-cyber-crime-advisory.html` | Advisory | Sri Lanka Police CID/CCID advisory (bilingual) |
| `faq.html` | Help | Accordion FAQ, category filter, live search |
| `security-tips.html` | Library | Filterable 12-tip library + article drawer |

### 3.3 Directory Structure

```
Embed/
├── index.html
├── account-password-security.html
├── ai-sensitive-information.html
├── device-security.html
├── email-security.html
├── physical-security.html
├── remote-wifi-security.html
├── external-incident-reporting.html
├── police-cyber-crime-advisory.html
├── faq.html
├── security-tips.html
├── README.md
├── .gitignore
├── js/
│   └── components.js          # Shared header/footer loader
├── components/
│   ├── header.html            # Reusable site header
│   └── footer.html            # Reusable site footer
├── embeds/
│   ├── report-incident-header.html
│   ├── sharepoint-embed-external-reporting.html
│   └── html-only-embed-external.html
├── images/                    # SOC logo, hero BGs, post images, posters
├── video/                     # Hero-loop MP4s (password, tripmed, email, AI)
├── docs/
│   ├── Midas Safety AI Policy_v1.md
│   ├── hosting-and-sharepoint-button-guide.md
│   └── sharepoint-embed-guide.md
└── archives/
    └── Embed.rar
```

### 3.4 Shared Component Infrastructure

Two mechanisms exist for rendering site chrome:

1. **Inline (duplicated) markup:** Most pages embed the header and footer markup + CSS directly inside the page for full self-containment.
2. **Dynamic injection:** `js/components.js` listens for `DOMContentLoaded`; if elements `#site-header` / `#site-footer` exist, it `fetch()`es `components/header.html` / `components/footer.html` and injects the response `innerHTML`. On fetch failure it logs a warning (single-page degradation is acceptable).

| File | Lines (approx.) | Notes |
|---|---|---|
| `js/components.js` | 32 | Loader only; no other logic |
| `components/header.html` | 358 | Banner + navbar + 2 dropdown menus + actions |
| `components/footer.html` | 319 | Brand block, SOC help card, 4 action buttons |

### 3.5 External Interfaces

| Interface | Type | Used By |
|---|---|---|
| Google Fonts | HTTPS (CSS/font) | All pages |
| `api.pwnedpasswords.com/range/{prefix}` | HTTPS GET (k-anonymity) | account-password-security |
| `api.xposedornot.com/v1/check-email/{email}` | HTTPS GET | email-security |
| `haveibeenpwned.com/account/{email}` | HTTPS deep link | email-security |
| `midassafety.sharepoint.com` | HTTPS | Header home link, AI policy PDF, Stream videos |
| `myaccount.google.com/security-checkup` | HTTPS deep link | account-password-security |
| `mysignins.microsoft.com/security-info` | HTTPS deep link | account-password-security |
| `mailto:cic@midassafety.com` + subjects | OS mail client | All pages |
| `tel:` hotlines (101, 1799, 011 2381058, etc.) | OS dialer | external-incident-reporting, police advisory |
| `flagcdn.com` | HTTPS images | external-incident-reporting |
| `postMessage('sharepoint-resize')` | parent window | embed components |

---

## 4. Functional Requirements

Each subsection below lists the module's responsibilities stated as testable requirements. Classes of priority: **M** (Mandatory for v1.0), **H** (High — should exist, adjustable), **L** (Low — enhancement).

### 4.1 Site-Wide Global Navigation & Shared UI (FND)

**FND-001** (M) The site SHALL render a consistent header on every page consisting of: brand logo (`images/SOC logo.png`), title "Midas Cyber Awareness & Security Hub", and a navigation bar with **Home**, **Topics (dropdown)**, **Policies**, **News**, **FAQ**, **Resources (dropdown)**, and a prominent **Security Incident Report** link.
- *Current behavior:* Topics dropdown links to all topic pages plus Policies, FAQ, SOPS; Resources dropdown links to the Passphrase Evaluator, Readiness Checklist, and Quick Incident Report; the Incident Report link is highlighted cyan `#38bdf8`.

**FND-002** (M) The Topics dropdown SHALL contain the following items with their targets:
AI & Sensitive Information → `ai-sensitive-information.html`; Account & Password Security → `account-password-security.html`; Device Security → `device-security.html`; Email & Phishing → `email-security.html`; Physical Security → `physical-security.html`; Remote / Wi-Fi Security → `remote-wifi-security.html`; Security Policies → `index.html#policies`; FAQ → `faq.html`; SOPS → `security-tips.html`.

**FND-003** (M) Dropdown menus SHALL open on hover, keyboard focus (`:focus-within`), and click (`.open` class toggle) and SHALL close when the user clicks outside. Only one dropdown SHALL be open at a time.
- *Current behavior:* dropdown toggles via `onclick="this.parentElement.classList.toggle('open')"` plus CSS `:hover`/`.focus-within`; no outside-click close handler — flagged in [Section 7](#7-known-gaps-defects-and-future-enhancements).

**FND-004** (M) The header SHALL render an "Add to favorites" star button. When clicked, if a `toggleFavorite(btn)` handler is defined the button SHALL toggle a `.favorited` visual state and swap the label between "Add to favorites" and "Added to favorites".
- *Current behavior:* `toggleFavorite` is defined only on `device-security.html`; the shared `components/header.html` calls it via a guarded `typeof` check. Favorites are non-persistent and purely cosmetic (see NFR-SEC-003 and gap section).

**FND-005** (M) The header SHALL render a "Site access" button that, when clicked, displays an alert stating "Site Access: You have full employee access to Midas Security Hub." (informational).

**FND-006** (M) The header SHALL highlight the currently-active section (e.g., active nav item shows a cyan underline `3px` bar).

**FND-007** (M) The footer SHALL render: brand block ("CYBER AWARENESS" / "& SECURITY" + tagline "Never Trust. Always Verify"), a red **Contact** button (`mailto:cic@midassafety.com`), a SOC help card stating to contact the SOC at `cic@midassafety.com`, and four circular action buttons: **Report Incident** (mailto with subject `Security Incident Report`), **Security Tips** (`security-tips.html`), **Alerts & Updates** (`index.html#news`), **About Portal** (`index.html`).

**FND-008** (M) All header/footer assets (logo, links) SHALL use repository-relative paths so pages work from any sub-folder of the intranet.

**FND-009** (H) Pages MAY use the dynamic loader (`js/components.js` + `<div id="site-header">`/`<div id="site-footer">`) instead of inline chrome, provided headers/footers render without console errors and with graceful fallback if the component fetch fails.

**FND-010** (M) Content pages SHALL reference each other through relative links so the site can be hosted under any path without hard-coded domain assumptions (except explicit intranet/SharePoint links, which are intentional).

**FND-011** (H) Navigation SHALL be keyboard-accessible: nav links, buttons, and dropdown items focusable and operable via keyboard.

**FND-012** (H) The header SHALL be responsive: banner stacks and nav wraps appropriately at narrow widths (approximately ≤ 960 px).

---

### 4.2 Home Portal Directory — `index.html` (FID)

**FID-001** (M) The homepage SHALL display a portal hero banner titled "Cyber Awareness & Training Directory" with a badge "🛡️ Central Security Knowledge Hub" and a description of the hub.

**FID-002** (M) The hero SHALL display a stats row. Requirement for accuracy: the displayed figures SHALL match the actual counts on the page (number of topics and number of live modules).
- *Current behavior:* hero states "12 Security Topics / 7 Active Live Modules"; the grid actually renders **15 cards** with **9 live** — inconsistency logged in [Section 7](#7-known-gaps-defects-and-future-enhancements).

**FID-003** (M) The homepage SHALL present a grid of topic module cards ("Security Awareness Modules"). Each card SHALL show: category icon, status tag (Live Module / Live Advisory / Live Knowledgebase / In Development), title, one-line description, and either an "Open Guide ➔" link or a disabled "Coming Soon" placeholder.

**FID-004** (M) The following module cards SHALL link to their targets and appear as **live**:
| Card | Target |
|---|---|
| AI & Sensitive Information Policy | `ai-sensitive-information.html` |
| Account & Password Security | `account-password-security.html` |
| Device Security Guide | `device-security.html` |
| Email Security & Phishing Spotter | `email-security.html` |
| Remote & Wi-Fi Security Guide | `remote-wifi-security.html` |
| Physical & Social Security | `physical-security.html` |
| External Incident Reporting (LK/BD/PK) | `external-incident-reporting.html` |
| Police Cyber Crime Advisory | `police-cyber-crime-advisory.html` |
| FAQ Knowledgebase | `faq.html` |

**FID-005** (M) The following planned cards SHALL appear with a "Coming Soon" disabled state: MFA; Data Protection & Privacy; Social Engineering Awareness; Incident Reporting & Response; Cloud & SaaS Security; Removable Media & Hardware.

**FID-006** (M) A search box (placeholder "Search security topics...") SHALL filter topic cards in real time on every keystroke by matching against each card's keyword data (`data-title`), hiding non-matching cards.
- *Current behavior:* `filterTopics()` compares query to `data-title`, lowercased/trimmed; case-insensitive; no debounce.

**FID-007** (M) The homepage SHALL render a "Quick Security Tools" section with three tools: **Passphrase Evaluator** → `account-password-security.html#tab-evaluator`; **Device Security Checklist** → `device-security.html`; and **Report Security Incident** → `mailto:cic@midassafety.com?subject=Security%20Incident%20Report`.

**FID-008** (H) The homepage SHALL include anchor targets for `#policies` and `#news` such that header footer and nav links to `index.html#policies` / `index.html#news` resolve to actual sections.
- *Current behavior:* no `#policies` / `#news` section elements exist on the page; anchors are dead — logged in [Section 7](#7-known-gaps-defects-and-future-enhancements).

**FID-009** (H) Cards SHALL have a hover lift effect (`translateY(-4px)`) and responsive grid that contracts to fewer columns on mobile.

---

### 4.3 Account & Password Security — `account-password-security.html` (FPA)

**FPA-001** (M) The page SHALL present four functional tabs via `switchTab(tabId)`: **9 Security Steps**, **Passphrase Evaluator**, **Security Readiness Checklist**, **Quick Security Checkup**.
- The tab bar SHALL be horizontally scrollable on narrow screens. Deep links of the form `#tab-steps`, `#tab-evaluator`, `#tab-checklist`, `#tab-checkup` SHALL select the corresponding tab on load.
- *Current behavior:* `switchTab` reads the implicit global `event` object; works from inline `onclick`; cross-page anchor links (e.g., `#tab-evaluator`) are honored only if initial hash handling is present — flagged in gaps.

**FPA-002** (M) The hero SHALL include a looping background video (`video/Hero Vid -password sec.mp4`, `autoplay loop muted playsinline`) with a left-fade mask overlay on desktop.

**FPA-003** (M) **9 Security Steps** tab SHALL display nine numbered step cards (01–09), each with a title, description, and a tip badge. The required content SHALL match [Appendix A.3](#a-content-rule-inventory-per-module):
1. Use strong, unique passphrases (4+ random words; never reuse).
2. Enable MFA (reject unexpected prompts).
3. Never share credentials or MFA codes.
4. Use an approved password manager.
5. Watch for phishing & suspicious links.
6. Lock screens & protect devices (`Win + L` / `Cmd+Ctrl+Q`).
7. Report incidents & suspicious activity promptly.
8. Keep software & OS updated.
9. Audit active sessions & connected apps (quarterly).

**FPA-004** (M) **Passphrase Evaluator** — a password input (masked by default) with a visibility toggle SHALL:
- Evaluate strength **live** on every input (`evaluatePassword()` on `oninput`).
- Report: character count; presence of uppercase, lowercase, numbers, and symbols; estimated time-to-crack; and a strength meter bar (width + color) with a label.
- Scoring rules SHALL be: +20 if length ≥ 8; +25 if length ≥ 12; +25 if length ≥ 16; +15 if both upper & lower present; +15 if numbers **or** symbols present.
- Output bands SHALL be: score ≤ 30 → bar 25% red "Weak" (crack time "Instant" if <8 chars else "Few minutes"); ≤ 70 → bar 60% amber "Moderate" ("Several months"); else → bar 100% green "Strong & Secure!" ("Centuries / Uncrackable").
- Empty input SHALL reset the meter, labels, and breach status.

**FPA-005** (M) **Privacy-preserving breach check** SHALL run automatically (debounced ~450 ms) as the user types:
- Compute SHA-1 of the passphrase (Web Crypto `crypto.subtle.digest`), uppercase hex.
- Send **only the first 5 characters** to `https://api.pwnedpasswords.com/range/{prefix}` (k-anonymity).
- Parse `suffix:count` lines; on match show "🚨 EXPOSED (N breaches)" (red, count formatted with thousands separators); otherwise "🛡️ Safe (Not in known breaches)" (green).
- On error/offline show "⚠️ Unable to check (Offline/Network)"; intermediate state "⏳ Checking breach database...".
- The raw passphrase SHALL NOT be transmitted, persisted, or logged (see NFR-SEC-006).
- Stale-input guard: results SHALL be discarded if the input changed during the async lookup.

**FPA-006** (M) The evaluator SHALL display a privacy note explaining that only a 5-character SHA-1 prefix leaves the browser.

**FPA-007** (M) **Security Readiness Checklist** SHALL display the seven audit items defined in [Appendix A.4](#a-content-rule-inventory-per-module) as checkboxes and a live score:
- Score = `round(checked/7 × 100)`%.
- Status text: 100% → "🎉 Excellent! You adhere to all key security best practices." (green); ≥ 50% → "Good progress! ..." (blue); else → "Complete all 7 items to achieve 100% compliance." (muted).

**FPA-008** (M) **Quick Security Checkup** tab SHALL offer two outbound cards: Google Account Security Checkup (`https://myaccount.google.com/security-checkup`, opens `_blank` with `rel="noopener noreferrer"`) and Microsoft Security Info (`https://mysignins.microsoft.com/security-info`).

**FPA-009** (H) The page SHALL provide a mechanism to copy the 9-step guidelines to the clipboard (`copyGuidelines()` via `navigator.clipboard.writeText` with a fallback alert).

**FPA-010** (M) The header favorites button on this page SHALL NOT throw a console/JS error when clicked.
- *Current behavior:* an unguarded `onclick="toggleFavorite(this)"` triggers a `ReferenceError` because `toggleFavorite` is not defined on this page — logged in [Section 7](#7-known-gaps-defects-and-future-enhancements).

---

### 4.4 AI & Sensitive Information Policy — `ai-sensitive-information.html` (FAI)

**FAI-001** (M) The page SHALL present the Midas AI Policy education content with hero title "Smart People. Responsible AI." and three value-prop badges: **Protect our data & IP / Respect our people / Build customer trust**.

**FAI-002** (M) The "Can I use AI for this?" classification widget SHALL:
- Offer a custom dropdown (non-native) with **9 selectable data-type options** defined in [Appendix A.5](#a-content-rule-inventory-per-module), a "Get Answer" submit button (disabled/neutral until a selection is made), and a floating result popover rendered below the widget without expanding the hero.
- On no selection and submit: SHALL alert "Please select a data type from the dropdown first."
- On selection and submit: SHALL render a themed result card containing: classification badge (PUBLIC/INTERNAL/RESTRICTED/PROHIBITED), the applicable rule, a description, and an action callout (including the 4-step approval process where relevant).
- The dropdown SHALL close when clicking outside it.

**FAI-003** (M) The 9 classification rule outcomes SHALL be data-accurate to the Midas AI Policy v1.0 (Sections 6, 6.1, 7.2, 7.7, 9):
1. **Public / Marketing** → Allowed, no restrictions; standard editorial review.
2. **Internal / Memos** → Allowed with caution; approved enterprise platforms only (never free/consumer tools); no customer PII/financials.
3. **Restricted / Customer data** → Requires approval (4-step).
4. **Restricted / Financials** → Requires Finance-manager written approval.
5. **Restricted / Formulas** → Requires HR/R&D sign-off; mandatory human-in-the-loop.
6. **Prohibited / Health & national IDs** → Never at any time.
7. **Prohibited / Code & credentials** → Never input source code, keys, or security configs into unapproved tools.
8. **Prohibited / Trade secrets** → Legal + AI Steering Committee approval required.
9. **Prohibited / Legal (litigation)** → Explicit Legal sign-off required.

**FAI-004** (M) The **Six Principles for Responsible AI** section SHALL render six clickable cards (Human Accountability, Responsible & Ethical Use, Transparency, Data Security, Fairness & Non-Discrimination, Continuous Learning). Clicking a card SHALL open a detail panel showing: the official policy clause reference, full rule body, "Key Guidelines & Employee Responsibilities" takeaways, and keyboard/visually-focusable close button; the panel SHALL smooth-scroll into view; clicking a different card SHALL switch selection; closing SHALL de-highlight cards.

**FAI-005** (M) The **Information Classification** matrix SHALL render the four-tier table (Public / Internal / Restricted / Prohibited for AI Input) with per-tier examples, colored status (Allowed / Allowed with caution / Requires approval / Not allowed at any time), and a notice pointing to the Section 6.1 4-step approval process.

**FAI-006** (M) The **RED ZONE** (Prohibited Use) card SHALL list the seven prohibited-use items defined in [Appendix A.6](#a-content-rule-inventory-per-module) and display the warning "When in doubt, don't input it."

**FAI-007** (M) The page SHALL include a policy video briefing player (16:9) with custom controls: play/pause, mute/unmute (with "Muted (Click for Sound)" / "Sound ON" states), elapsed-time display (`m:ss / m:ss`), fullscreen toggle (with `webkitRequestFullscreen` fallback), and a "SharePoint Stream ↗" external link. The player SHALL attempt local `video/Our approach to responsible AI.mp4` first, then fall back to the two listed SharePoint Stream URLs.

**FAI-008** (M) The page SHALL link to the full policy (PDF) at least in the classification matrix, principles section, and the final policy card (≥ 3 touch-points per current implementation).

**FAI-009** (M) Content meta SHALL display "AI Policy v1.0 | Effective 24 Aug 2026 | Next Review Aug 2027".

**FAI-010** (M) The header SHALL be the reduced variant (Home/Topics/Policies/News/FAQ and no action buttons) as implemented.

---

### 4.5 Device Security — `device-security.html` (FDS)

**FDS-001** (M) The page SHALL provide a quick-jump bar with three smooth-scroll buttons (`scrollIntoView({behavior:'smooth'})`) to sections: **Windows Devices**, **Android Devices**, **iOS Devices**.

**FDS-002** (M) Each platform section SHALL present **7 numbered steps**; steps 1–4 visible by default and steps 5–7 behind an expand toggle ("Show steps 5–7" ↔ "Hide steps 5–7") that flips a chevron and uses a `.show` class. The required rule content SHALL match [Appendix A.7](#a-content-rule-inventory-per-module).

**FDS-003** (M) Each platform section SHALL end with a color-coded **Golden Rule** banner:
- Windows: "Never disable Windows Defender, BitLocker, or automatic security patches."
- Android: "If it's not from the Play Store, don't install."
- iOS: "If it's not from the App Store, don't install."

**FDS-004** (M) Each step SHALL include a "💡 TIP" callout box with practical guidance.

**FDS-005** (H) This page SHALL define `toggleFavorite(btn)` (cosmetic star toggle) as the site-wide reference implementation.

**FDS-006** (H) The quick-jump bar SHALL include a help note: "Not sure what you use? Check your device settings or ask your IT manager."

---

### 4.6 Email Security & Phishing Spotter — `email-security.html` (FES)

**FES-001** (M) The page SHALL present an interactive **"Spot the Red Flags"** mock Microsoft Outlook email with 8 numbered hotspot badges (7 red flags + 1 green recommended action) placed on header fields (From, To, Date, Subject), email body content, a CTA link, and an attachment row.

**FES-002** (M) Hovering/focusing a hotspot SHALL show a popover tooltip (`showSpotterTooltip(id, el, e)`) with title + description from the `flagDetails` data, highlight the field `.active-highlight`, and activate the badge. Leaving SHALL remove the highlight and hide the popover. Clicking a hotspot SHALL also scroll the matching detailed flag card into view (`selectFlag(id)`).

**FES-003** (M) A detailed card list SHALL show flagship cards for each of the 8 flags. Cards 4–8 SHALL be hidden by default with a toggle "∨ Show 4–8" / "∧ Show Less." The red-flag content SHALL match [Appendix A.8](#a-content-rule-inventory-per-module).

**FES-004** (M) The CTA link in the fake email SHALL be a `javascript:void(0)` trap that, when clicked, displays the alert: "SECURITY ALERT: This is a simulated phishing link! Never click suspicious links."

**FES-005** (M) The page SHALL render a "How to Report in Outlook" guide (4 steps: Open email → Click Report → Choose Report Phishing → Done) and a fallback "can't find the Report button" contact card forwarding to `cic@midassafety.com` (mailto, subject `Suspicious Phishing Email Report`).

**FES-006** (M) **Email Breach Exposure Checker** SHALL:
- Accept an email `#emailCheckInput`, trim and lowercase on submit (button or Enter key).
- Validate format (contains `@` and a `.`); invalid → "⚠️ Please enter a valid email address…".
- If the email matches a built-in test vector (`user@example.com`, `test@example.com`, `pwned@example.com`) → show "EXPOSED" result with breach tag chips and remediation list (no network call).
- Otherwise query `https://api.xposedornot.com/v1/check-email/{email}`:
  - Breach(s) present → "EXPOSED IN N DATA BREACH(ES)" with up to 16 breach chips (+ "+N more" overflow), remediation list, and a "🌐 View Official HIBP Report" link to `https://haveibeenpwned.com/account/{email}`.
  - None → "🛡️ CLEAN IN PUBLIC APIS" with note that HIBP may hold additional private datasets plus a direct HIBP link.
  - Network/HTTP failure → "⚠️ Real-Time API Check" fallback box linking to HIBP account page.
- Render results by injecting HTML through an `escapeHtml` sanitizer to prevent XSS.
- Display a trust/privacy note: queries are TLS-encrypted and never stored or logged.

**FES-007** (M) The hero SHALL support a background looped video (`video/email-sec-Hero-section.mp4`, autoplay/loop/muted) with a left fade and glassmorphism content panel.

**FES-008** (H) After a confirmed breach, the page SHALL recommend remediation: change passwords immediately; enable MFA; never reuse the Midas work password on personal accounts; verify on HaveIBeenPwned.com.

---

### 4.7 Physical & Social Engineering Security — `physical-security.html` (FHS)

**FHS-001** (M) This page SHALL present the "7 Simple Habits That Keep Us Safe" as a vertical list of habit cards. Requirement content per [Appendix A.9](#a-content-rule-inventory-per-module).

**FHS-002** (M) Each habit card SHALL display a numbered badge, an emoji icon, title, description, and an amber tip callout.

**FHS-003** (M) The hero SHALL include three badges: "🛡️ Badge Discipline", "👥 Visitor Verification", "🔒 Tailgating Defense", and the provided imagery (`images/image-1.png`).

**FHS-004** (L) This page MAY remain static (no interactive components beyond the shared nav) — no behavioral requirements beyond content accuracy and layout.

---

### 4.8 Remote & Wi-Fi Security — `remote-wifi-security.html` (FRS)

**FRS-001** (M) The page SHALL present three tabs via `switchSectionTab(tabId)` and honor URL hash routing (deep links) `#simulator`, `#vpn` / `#vpn-visualizer`, and any other hash→**Key Security Tips** (default tab).

**FRS-002** (M) **Interactive Wi-Fi Simulator** SHALL offer four mode buttons:
1. **Open Public Wi-Fi** → Grade F; no encryption; packet-sniffing HIGH RISK; MITM vulnerable (rogue APs); action: "Never log into internal Midas applications … without turning on Midas Corporate VPN first."
2. **Public Wi-Fi + Corporate VPN** → Grade A+; AES-256 tunnel; zero-risk eavesdropping; IPSec/SSL protected; safe for corporate access.
3. **Personal Mobile Hotspot** → Grade A; WPA3/cellular LTE/5G; very low risk; recommended when public Wi-Fi is slow/suspicious.
4. **Unsecured Home Wi-Fi** → Grade C; default passwords/WEP/WPA-TKIP; moderate risk; harden router credentials and enable WPA3/WPA2-AES.

Selecting a mode SHALL update: the stage title, grade badge (letter + color class), description, four metric boxes (**Encryption Protocol / Packet Eavesdropping / Man-In-The-Middle / Recommended Action**), the security advice callout, and the animated topology line colors (danger/secure).

**FRS-003** (M) The **Corporate VPN vs Public Wi-Fi** visualizer SHALL offer two toggles:
- "🚨 Plain Public Wi-Fi (Hacker View)" → render 3 plain-text "exposed" packet rows (HTTP login with user/pass, document, DNS query), styled red.
- "🛡️ Midas VPN Encrypted Tunnel (Secured View)" → render 3 AES-256 ciphertext rows, styled green, showing origin IP masked behind the "Midas VPN Gateway".
The toggle SHALL swap an `.active` state (red=unprotected, green=protected).

**FRS-004** (M) **Key Security Tips** tab SHALL display the six tip cards defined in [Appendix A.10](#a-content-rule-inventory-per-module) with numbered badges and amber callout boxes.

**FRS-005** (H) Optional **Golden-Rule detail modals** (6 rules: VPN priority, disable auto-connect, evil-twin hotspots, shoulder-surfing/airport privacy screens, never leave assets unattended, personal mobile tethering) MAY remain dormant provided no UI trigger exposes an unhandled error.
- *Current behavior:* `showRuleModal/closeRuleModal` and `ruleData` exist but no visible trigger is wired; the modal is dead code — logged in [Section 7](#7-known-gaps-defects-and-future-enhancements) with a recommendation to either complete or remove.

**FRS-006** (M) The hero SHALL support a looping background video (`video/Hero Vid - tripmed.mp4`) with a fade mask.

---

### 4.9 External Incident Reporting — `external-incident-reporting.html` (FXR)

**FXR-001** (M) The page SHALL present an opening notice distinguishing report routes: for **Midas-owned assets** email the SOC at `cic@midassafety.com`; the page's external channels are for personal/third-party issues only.

**FXR-002** (M) The page SHALL provide a country-filter tab bar: **🌐 View All**, 🇱🇰 **Sri Lanka**, 🇧🇩 **Bangladesh**, 🇵🇰 **Pakistan**. Selecting SHALL show/hide the corresponding country timeline sections (`filterCountry`) and SHALL be usable together with the wizard.

**FXR-003** (M) An **Incident Decision Wizard** SHALL present 5 scenario buttons and, on selection, display a rich recommendation (title + body) and highlight the matching country-channel cards (`active-highlight`):
1. 📞 Urgent Assistance & Cyber Attack (emergency helpline)
2. ⚖️ Cyber Crime & Financial Fraud
3. ✉️ General Cyber Incident & Technical Escalation
4. 👤 Social Media & Online Unlawful Content
5. 🌐 Formal Online Complaint Portals

**FXR-004** (M) The **Sri Lanka (LK)** timeline SHALL include: SL CERT hotline **101**; Cyber Crime Division **011 230 4518 / 011 230 4519**; `report@cert.gov.lk`; `socialmedia@cert.gov.lk`; **Tell IGP** portal; Police CID `dir.cid@police.gov.lk`; CCID takedown `ccid.report@police.gov.lk`.

**FXR-005** (M) The **Bangladesh (BD)** timeline SHALL include: CID Cyber Helpline **01733 694162**; BGD e-GOV CIRT hotline **+88 02 8181392**; `incidents@cirt.gov.bd`; CIRT portal; CSCID emergency channel.

**FXR-006** (M) The **Pakistan (PK)** timeline SHALL include: NCCIA hotline **1799**; NCCIA portal; `helpdesk@nccia.gov.pk`; PTA content complaint `content-complaint@pta.gov.pk`.

**FXR-007** (M) Every channel item SHALL be actionable via native mechanisms: `mailto:` links with pre-filled concern-subject lines, `tel:` hotline dialing, or `target="_blank" rel="noopener"` official portals.

**FXR-008** (H) The page SHALL render country flags using external flag images and SHALL degrade gracefully if images fail to load (accessible alternative text).

**FXR-009** (M) This page SHALL NOT submit any data to a server; all escalation is via the user's own mail/phone/portal apps.

---

### 4.10 Police Cyber Crime Advisory — `police-cyber-crime-advisory.html` (FPC)

**FPC-001** (M) The page SHALL present the official-style Sri Lanka Police public advisory (bilingual headline English + Sinhala) about reporting cyber crime and illegal Facebook groups that harass or distribute unauthorized images.

**FPC-002** (M) Three channel cards SHALL render with pill tags and actionable contacts:
- **CID** (blue): `dir.cid@police.gov.lk` (mailto with complaint subject pre-filled).
- **CCID** (rose): `ccid.report@police.gov.lk` (mailto with takedown subject pre-filled).
- **Police CCID hotline** (emerald): `tel:0112381058`.

**FPC-003** (M) A key public notice box SHALL state (English + Sinhala) that CID/CCID deactivate illegal accounts/groups and can arrest suspects, and direct evidence submission to the official emails.

**FPC-004** (M) Sinhala text SHALL render correctly (font `Noto Sans Sinhala` loaded; correct `lang` attribute).

**FPC-005** (H) No additional interactive logic is required beyond the shared nav; any `toggleFavorite` invocation SHALL be guarded.

---

### 4.11 FAQ / Help Center — `faq.html` (FFA)

**FFA-001** (M) The page SHALL present a hero help-center banner with a live search box (placeholder "Type a keyword (e.g. password, phishing, VPN, stolen phone)..."), a sidebar with **6 category filter buttons** (each with a count pill), and an accordion group of **12 Q&A cards**.

Categories and counts SHALL be: 🌟 All Questions (12), 🔑 Passwords & Accounts (3), 📧 Phishing & Email (3), 📱 Device Hardening (2), 🌐 Remote & Wi-Fi Security (2), 🚨 Incident Reporting (2).

**FFA-002** (M) Accordion behavior (`toggleFaq(btn)`): single-open; opening one card SHALL close any other open card; answer body animates in (`fadeIn`); active state `.open` SHALL add a chevron rotation.

**FFA-003** (M) Category filter (`filterCategory`) SHALL show only cards matching the selected `data-cat` (or all for "All"), updating button active state.

**FFA-004** (M) Live search (`filterFaqs`) SHALL filter cards on each keystroke by matching keyword data (`data-keywords`) and card text.

**FFA-005** (M) Each answer SHALL include a "Was this answer helpful?" 👍/👎 feedback row; clicking SHALL replace it with "✓ Thank you for your feedback!" (green). No aggregation/storage.

**FFA-006** (M) The 12 Q&A content SHALL match [Appendix A.11](#a-content-rule-inventory-per-module) and SHALL link to the relevant module pages and SOC mailbox where applicable.

**FFA-007** (H) Any advertised "Ask the SOC a question" form (as implied by the index card copy and dead CSS `.ask-box-card`) SHALL either be implemented with working submit behavior OR removed from all copy/CSS so users are not led to a non-functional control.
- *Current behavior:* only CSS exists; no form rendered — logged in [Section 7](#7-known-gaps-defects-and-future-enhancements).

**FFA-008** (L) The help-center hero SHALL render the FAQ background image with dark overlay.

---

### 4.12 Security Tips Library — `security-tips.html` (FST)

**FST-001** (M) The page SHALL provide live filtering of **12 tips** via: a search box matching title/category/keywords; **7 category checkboxes** (Email & Phishing, Passwords & Accounts, Devices & Data, Working Remotely, Wi-Fi & Internet, Physical Security, General Awareness); **4 audience radio options** (Office / Factory & Operations / Field / Everyone); and a **sort dropdown** (Most relevant / Title A–Z).

**FST-002** (M) Filtering SHALL be immediate on change (`filterTips()`), and the results bar SHALL display the count ("Showing N tips"). A **Clear filters** action SHALL reset all controls.

**FST-003** (M) A **"💡 New here? Top 5"** callout SHALL filter to tips flagged `data-top5="true"` and update the count text.

**FST-004** (M) Each tip card SHALL display an icon, category pill, title, and summary, and a "Read more" action that opens a **slide-over article drawer** (`openArticle(id)`) populated from `articlesData` (title, intro, **Why This Matters**, **Key Security Rules** bullets, and an **action-item/takeaway** box). The drawer SHALL be closeable via a close button or clicking the backdrop (`closeArticleOnBackdrop`).

**FST-005** (M) The 12 tips' content SHALL match [Appendix A.12](#a-content-rule-inventory-per-module).

**FST-006** (H) The category "all" master checkbox SHALL keep per-category checkbox states coherent when toggled.

**FST-007** (H) The sticky sidebar SHALL remain usable on mobile (stacked above content, not overlapping).

---

### 4.13 SharePoint Embed Components — `/embeds` (FEM)

**FEM-001** (M) `embeds/sharepoint-embed-external-reporting.html` SHALL be a self-contained, full-width widget titled "How to Report an Incident Outside of MIDAS" with a red accent bar, subtitle, an external-incident CTA link, and a laptop-and-shield SVG illustration. Its embedded script SHALL auto-resize: on `load`, `resize`, and via `ResizeObserver`, post `{ type: 'sharepoint-resize', height: <container height + 24> }` to `window.parent` via `postMessage`.

**FEM-002** (M) `embeds/report-incident-header.html` SHALL be a self-contained header component ("Report a Security Incident", tagline "NO JUDGMENT — REPORTING FAST HELPS EVERYONE.") with Midas headset-ribbon SVG logo, vertical divider, and orbital shield graphic; SHALL be responsive at 992 px and 768 px breakpoints.

**FEM-003** (M) `embeds/html-only-embed-external.html` SHALL be the zero-JavaScript variant of the external-reporting widget (pure HTML/CSS) whose red CTA deep-links to the hosted `external-incident-reporting.html#wizard` page in a new tab with `rel="noopener noreferrer"`.

**FEM-004** (M) Embed pages SHALL use `background-color: transparent` on `body` so the SharePoint page background shows through, and SHALL include zero outside margin.

**FEM-005** (H) Embed widgets SHALL be usable inside SharePoint Embed Web Parts at recommended heights of 750–800 px as documented in `docs/sharepoint-embed-guide.md`.

**FEM-006** (H) Empl embeddables SHALL support the documented iframe snippet: `width="100%" height="750px" frameborder="0" scrolling="auto" style="border:none; border-radius:16px;"`.

---

### 4.14 Feature Interaction Matrix

| Interaction | Pages |
|---|---|
| Topic search (live filter on `data-title`) | index |
| Live passphrase scoring + HIBP k-anonymity check | account-password-security |
| Breach check (XposedOrNot) + HIBP deep-link | email-security |
| AI data-classifier widget + principle detail panels | ai-sensitive-information |
| Wi-Fi threat simulator + VPN visualizer + hash routing | remote-wifi-security |
| Country filter + decision wizard cross-highlighting | external-incident-reporting |
| FAQ accordion/​filter/​search/​feedback | faq |
| Tips filter/search/audience/sort + article drawer | security-tips |
| Device jump-nav + expandable steps + favorites | device-security |
| PostMessage auto-resize bridge | embeds/* |

---

## 5. External Interface Requirements

### 5.1 User Interface

- **Consistency:** All pages SHALL share the design-token palette: bg `#f8fafc`, surface `#ffffff`, primary slate `#0f172a`/`#020617`, accent amber `#f59e0b`, action blue `#2563eb`, danger red `#e11d48`, success green `#10b981`, highlight cyan `#38bdf8`; radii 8/12/16; shadow tiers `--shadow-sm/md/lg`; hover lift `translateY(-4px)` on cards.
- **Typography:** `Plus Jakarta Sans` (400–800) via Google Fonts with system fallback; `Noto Sans Sinhala` on the police advisory; `Caveat` only as decorative annotation on the AI widget.
- **Responsive:** breakpoints ~1200 / 992 / 960 / 900 / 640 / 580 / 520 px per page as implemented; no horizontal overflow on ≤360-px viewports.
- **Progress feedback:** All async actions (breach checks, component fetch) SHALL expose intermediate states ("⏳ Checking…"/warning) rather than blocking.
- **Content safety:** Site SHALL use the yellow/amber "SECURITY GUIDE"/"SECURITY TIP" badge convention on training heroes.

### 5.2 Hardware Interfaces

None. The product drives no dedicated hardware. Video/audio playback and clipboard depend on browser-level OS facilities.

### 5.3 Software Interfaces

| Interface | Direction | Data | Security |
|---|---|---|---|
| Google Fonts CSS API | OUT (browser→CDN) | font family requests | TLS |
| HIBP range API | OUT | 5-char SHA-1 prefix | TLS (k-anonymity) |
| XposedOrNot check-email | OUT | full email address | TLS; documented "never stored/logged" claim SHALL be honored by the UI trust note |
| SharePoint Stream | OUT | video playback streaming | TLS, intranet auth |
| Microsoft / Google checkup sites | OUT (user navigation) | none from app | TLS |
| OS mail (mailto:) | OUT (user) | user-composed subject/body | user-managed |
| OS dialer (tel:) | OUT (user) | phone number | user-managed |
| Parent frame (embeds) | OUT | postMessage height | `'*'` origin (see gap notes) |

### 5.4 Communications Interfaces

- All runtime network access is HTTPS.
- Embeds communicate with the parent frame via `window.parent.postMessage({ type:'sharepoint-resize', height })` with targetOrigin `'*'` (current implementation). $(See 7.6 / NFR-SEC-008 for recommended tightening.)
- No long-lived connections, no WebSockets, no server push.

### 5.5 Data Flows

1. **Passphrase evaluation (account-password-security):** user input → local metrics → SHA-1 digest (client) → 5-char prefix to HIBP → suffix count parsed → result rendered. Full passphrase never leaves the page.
2. **Email breach check (email-security):** email input → (test vector short-circuit) OR → API call → breach list → status + remediation. Email leaves the page to XposedOrNot and appears in a HIBP URL.
3. **AI classifier (ai-sensitive-information):** selection (9 predefined keys) → local map lookup → themed result card. No data leaves the page.
4. **Incident escalation (external-reporting / police):** user action → OS mail/dialer or official portal (external). No app-level transmission.
5. **Component injection:** browser → fetch `components/*.html` → innerHTML injection.
6. **Embed resize:** child → parent `postMessage`.

---

## 6. Non-Functional Requirements

### 6.1 Performance Requirements (NFR-PERF)

- **NFR-PERF-001** (M) Page weight: each page SHALL remain lightweight for an intranet; no render-blocking third-party script beyond Google Fonts stylesheet is permitted.
- **NFR-PERF-002** (M) Topic search (`index`), FAQ search, and tips filtering SHALL respond to each keystroke with no perceptible lag (< 300 ms on modern hardware) over the implemented result set.
- **NFR-PERF-003** (M) The password evaluator SHALL update live under the 450 ms debounce; the HIBP request SHALL be the only network cost and SHALL NOT block typing.
- **NFR-PERF-004** (H) Hero videos SHALL use `autoplay`/`loop`/`muted`/`playsinline` and SHOULD NOT block `DOMContentLoaded`; poster images SHALL be provided.
- **NFR-PERF-005** (H) Embeds SHALL avoid layout shift: container SHALL communicate resized height so the parent iframe never shows scrollbars.
- **NFR-PERF-006** (L) All images SHOULD have encoded dimensions or `aspect-ratio` to prevent CLS (cumulative layout shift).

### 6.2 Security & Privacy Requirements (NFR-SEC)

- **NFR-SEC-001** (M) The passphrase SHALL NEVER be sent over the network, stored in `localStorage`/`sessionStorage`, logged, or rendered into any persistent store. Only the 5-character SHA-1 prefix SHALL leave the browser (k-anonymity) — this SHALL be stated to the user on the evaluator page.
- **NFR-SEC-002** (M) Any untrusted string interpolated into `innerHTML` SHALL pass through an `escapeHtml`-type sanitizer (as implemented in the email breach checker).
- **NFR-SEC-003** (M) No analytics, tracking pixels, or third-party fingerprinting SHALL be added without a privacy review.
- **NFR-SEC-004** (M) External dashboards (Google/Microsoft) SHALL open with `target="_blank" rel="noopener noreferrer"`.
- **NFR-SEC-005** (M) Mail and dial actions SHALL pre-fill only subject/content metadata (no sensitive user data) unless the user composes it.
- **NFR-SEC-006** (M) The checkbox/audit scores SHALL not be used for any security control decision; they are educational only.
- **NFR-SEC-007** (M) No credential, key, or internal configuration SHALL ever appear in page source (including the analyzer's educational examples) — page design SHALL treat all embedded examples as fictional/simulated.
- **NFR-SEC-008** (H) The embed `postMessage` SHALL target the specific parent origin (SharePoint tenant) rather than `'*'` to prevent cross-origin data leakage of resize metrics; change is recommended (current code sends to `'*'`).
- **NFR-SEC-009** (H) The `javascript:` trap link on the simulated email SHALL remain labeled clearly as simulated so it cannot be mistaken for a real link.

### 6.3 Reliability & Availability

- **NFR-REL-001** (M) Breach-check failures (offline/API down) SHALL degrade to a visible explanatory message + a deep-link fallback rather than a broken UI.
- **NFR-REL-002** (M) Header/footer fetch failures SHALL be non-fatal (console warning only), leaving page content usable.
- **NFR-REL-003** (H) Media (video) loading failure SHALL leave the poster/banner visible; no broken element boxes.
- **NFR-REL-004** (L) Video players with multiple `<source>` fallbacks SHALL advance to the next source automatically when a source 404s (browser-native behavior expected; no custom error trap required).

### 6.4 Usability & Accessibility

- **NFR-US-001** (M) All interactive controls SHALL be reachable via keyboard (`Tab`) where they are buttons/links.
- **NFR-US-002** (H) Interactive regions (accordions, tooltips, tabs, modals, dropdowns) SHOULD expose `aria-expanded`, `aria-controls`, `role`/`aria-label` semantics; current implementation is largely missing these — see [Section 7](#7-known-gaps-defects-and-future-enhancements).
- **NFR-US-003** (H) Color alone SHALL NOT carry meaning: grade badges and status pills SHALL convey state via text too (e.g., "GRADE F", "EXPOSED"). Current implementation includes text labels — maintain this.
- **NFR-US-004** (H) Tooltips on the phishing spotter SHALL also activate on keyboard focus, not only mouse hover.
- **NFR-US-005** (M) Visible focus indicators SHALL remain on all focusable elements (default browser outline SHALL NOT be removed without replacement).
- **NFR-US-006** (H) Sinhala content SHALL set `lang="si"` appropriately.

### 6.5 Maintainability & Portability

- **NFR-MAINT-001** (M) No build system SHALL be required to deploy; a file copy to static hosting SHALL suffice.
- **NFR-MAINT-002** (H) New topic pages SHALL reuse the shared header/footer conventions and (preferably) `components/header.html` + `js/components.js` to avoid triplicating chrome CSS.
- **NFR-MAINT-003** (H) Embedded data maps (`classificationData`, `principleData`, `stimData`, `simData`, `ruleData`, `flagDetails`, `articlesData`, `knownPwnedEmails`, `scenarioData`) SHALL be centralized in one clearly-marked data block per page for content-author edits.
- **NFR-MAINT-004** (M) Asset paths SHALL remain repository-relative; renaming a page SHALL update every internal link (a link-check pass is recommended, see [Section 8](#8-verification--validation)).

### 6.6 Compliance & Legal

- **NFR-COMP-001** (M) All educational content SHALL be consistent with the Midas Safety AI Policy v1.0 and the printed shareable policy links.
- **NFR-COMP-002** (M) Contact channels (emails, hotlines, government portals) SHALL be reviewed against official sources annually by SOC; no unofficial contact details SHALL be published.
- **NFR-COMP-003** (L) The site SHALL NOT collect or process personal data beyond the transient email used for the breach lookup, which the page shall disclose.

---

## 7. Known Gaps, Defects, and Future Enhancements

Findings from the deep code analysis. Items prefixed **FIX** are defects; **ENH** are enhancements; **INFO** are informational.

| ID | Severity | Location | Finding | Recommended Action |
|---|---|---|---|---|
| G-01 **FIX** | High | `account-password-security.html` | `toggleFavorite(this)` is called unguarded but the function is undefined on this page → `ReferenceError` on click. | Guard with `typeof toggleFavorite === 'function'` as on other pages, or define the function. |
| G-02 **FIX** | Medium | `index.html` | Hero stats (12 topics / 7 active) disagree with the actual grid (15 cards, ~9 live). | Recompute displayed counts from the grid or auto-derive them in JS. |
| G-03 **FIX** | Medium | `index.html` | `index.html#policies` and `index.html#news` anchors are referenced in nav/footer but no such sections exist on the page. | Add Policies and News sections or retarget links. |
| G-04 **FIX** | Medium | `faq.html` | Site advertises "SOC question submission"; only dead CSS (`.ask-box-card`) exists, no form/JS. | Implement form (mailto: to `cic@midassafety.com`) or remove copy/styles. |
| G-05 **INFO** | Medium | `remote-wifi-security.html` | `showRuleModal`/`closeRuleModal` + `ruleData` are implemented but no UI trigger renders them (dead feature). Also `.checklist-card`, `.quiz-card`, `.cert-result-card` CSS exists with no HTML. | Wire the Golden-Rules modals or remove the dead code. |
| G-06 **INFO** | Medium | Global nav | Dropdowns have no outside-click/​Escape-close handler; opening one then clicking outside leaves it open (except on AI page, which does have a doc-click handler). | Add `document` click-away + `Escape` handling uniformly. |
| G-07 **INFO** | Low | `faq.html`, shared header | Favorites star is a no-op on most pages (only `device-security.html` defines it) and persists nothing. | Decide product intent: persist via `localStorage` + per-page ref, or remove the control. |
| G-08 **INFO** | Low | Tabs (password, remote-wifi) | `switchTab` / `selectSimMode` rely on the implicit global `event` object — works only from inline `onclick`. Deep-link hash handling for `#tab-*` is not verifiably implemented on load for password page. | Refactor to explicit element references and add load-time hash handling. |
| G-09 **INFO** | Low | `email-security.html`, `remote-wifi-security.html` | Duplicate `<source>` entries reference identical video files; email hero video source duplicated. | Remove the duplicate sources. |
| G-10 **INFO** | Low | Embeds | `postMessage` uses `'*'` target origin. | Restrict to the SharePoint tenant origin. |
| G-11 **ENH** | Medium | Global | No `localStorage` persistence for favorites, checklist completion, or quiz progress. Products advertising "readiness" would benefit from lightweight localStorage persistence. | Optional enhancement pending privacy review. |
| G-12 **ENH** | Medium | `remote-wifi-security.html` | Planned checklist/quiz/certificate modules (CSS present) are not implemented on this page. | Build or remove; if build, mirror account-password checklist logic. |
| G-13 **ENH** | Low | Global | Accessibility: accordions lack `aria-expanded`; tooltips keyboard/touch activation inconsistent; modals lack ESC/focus-trap. | Add ARIA roles/states and focus management. |
| G-14 **INFO** | Low | `external-incident-reporting.html` | Country flags loaded from external `flagcdn.com` — offline degrades alt text only. | Acceptable; consider bundling flags for offline fidelity. |
| G-15 **INFO** | Info | `js/components.js` | Loader is inert on most pages because placeholders are absent (pages inline chrome instead). | Either standardize on placeholders or document the inline convention. |

---

## 8. Verification & Validation

### 8.1 Verification Matrix (Traceability)

Each functional requirement maps to one or more verifiable artifacts. The complete matrix (requirement → test case → status) is maintained alongside test execution; primary mapping:

| Module | Requirements → Test Suites |
|---|---|
| FND (Global UI) | `FND-001`–`FND-012` → TC-NAV-01..12 |
| FID (Home) | `FID-001`–`FID-009` → TC-PORTAL-01..09 |
| FPA (Account) | `FPA-001`–`FPA-010` → TC-PASS-01..10 |
| FAI (AI) | `FAI-001`–`FAI-010` → TC-AI-01..10 |
| FDS (Device) | `FDS-001`–`FDS-006` → TC-DEV-01..06 |
| FES (Email) | `FES-001`–`FES-008` → TC-EMAIL-01..08 |
| FHS (Physical) | `FHS-001`–`FHS-004` → TC-PHYS-01..04 |
| FRS (Remote) | `FRS-001`–`FRS-006` → TC-REMOTE-01..06 |
| FXR (External) | `FXR-001`–`FXR-009` → TC-EXT-01..09 |
| FPC (Police) | `FPC-001`–`FPC-005` → TC-POLICE-01..05 |
| FFA (FAQ) | `FFA-001`–`FFA-008` → TC-FAQ-01..08 |
| FST (Tips) | `FST-001`–`FST-007` → TC-TIPS-01..07 |
| FEM (Embeds) | `FEM-001`–`FEM-006` → TC-EMBED-01..06 |
| NFR | All → TC-NFR-PERF/SEC/US/REL |

### 8.2 Test Approach

1. **Static checks:** HTML validation (W3C), broken-link audit across all internal `href`/`src`, lint of inline JS (console errors).
2. **Functional smoke tests** per module (manually or via Playwright/cypress if later adopted): tabs, filters, accordions, evaluator scoring bands (| math-v check: single-char vs 16-char scenarios), HIBP k-anonymity assertion (only `/range/` + 5-char prefix observed in DevTools), artificial API offline simulation, hash deep-linking, embed resize `postMessage` message shape.
3. **Privacy checks:** DevTools Network tab on password page (assert full passphrase never leaves; only prefix), assert no `localStorage` writes site-wide.
4. **Cross-browser/viewport pass** at 360 / 768 / 1024 / 1280 px.
5. **Content audit:** Reconcile counts (G-02), anchors (G-03), and dead features (G-04, G-05) with PM sign-off.

---

## 9. Appendix

### A. Content Rule Inventory per Module

#### A.1 Hub-wide brand rules
- Tagline: **"Never Trust. Always Verify."**
- SOC contact: `cic@midassafety.com` (internal incidents, phishing, account issues, lost devices, general help).

#### A.2 Home quick tools
- Passphrase Evaluator; Device Security Checklist; Report Security Incident (mailto).

#### A.3 Account & Password Security — 9 steps
1. Strong, unique passphrases — 4+ random words (e.g., `coffee-ocean-rocket-guitar`), ≥16 chars, never reused.
2. Enable MFA; reject unexpected prompts ("MFA blocks over 99% of automated attacks").
3. Never share credentials or MFA codes; IT never asks, never via email/Teams/phone.
4. Use the approved password manager; no sticky notes.
5. Watch for phishing & suspicious links; check full sender address, hover before clicking.
6. Lock screens: `Windows + L` / `Cmd + Control + Q`.
7. Report incidents & suspicious activity promptly.
8. Keep software & OS updated; enable automatic updates.
9. Audit active sessions & connected apps quarterly.

#### A.4 Account & Password — 7-item readiness checklist
1. Passphrases ≥16 chars / 4+ words.
2. MFA on all work & email accounts.
3. No password reuse across accounts.
4. Enterprise password manager in use.
5. Screen-lock habit established.
6. Verify senders/links before clicking.
7. Know how to report incidents.

#### A.5 AI classifier — 9 options
Public/marketing; Internal/memos; Restricted/customer data; Restricted/financials; Restricted/formulas (people decisions); Prohibited/health & national IDs; Prohibited/code & credentials; Prohibited/trade secrets; Prohibited/legal (litigation).

#### A.6 AI — Red Zone (7 prohibited uses)
1. Share confidential/personal/sensitive data into unapproved tools.
2. Input Midas IP, trade secrets, proprietary info.
3. Engage in illegal, unethical, or harmful activities.
4. Bypass security controls or break systems.
5. Create/share discriminatory or biased content.
6. Present AI-generated content as one's own work.
7. Use unapproved (public) AI tools for company work.

#### A.7 Device Security — per-platform steps (7 each)
- **Windows:** Win+L locking (auto ≤5 min); keep BitLocker + Defender on; install patches/reboot weekly; approved software + password vaults; VPN for remote; cautious with `.exe`/`.vbs`/macro attachments; report lost PC to IT. Golden rule: never disable Defender/BitLocker/patches.
- **Android:** lock with strong PIN ≥6; Google Play only (no APK sideload); update OS+apps; Find My Device on; Enterprise Work Profile isolation; avoid open Wi-Fi w/o VPN + disable auto-join; review/revoke permissions. Golden rule: Play Store only.
- **iOS:** strong 6-digit+ passcode + Face/Touch ID; App Store only; automatic updates; Find My iPhone + Send Last Location; hide sensitive lock-screen previews; encrypted backups & Data Protection; disable Wi-Fi auto-join. Golden rule: App Store only.

#### A.8 Email — 7 red flags (+1 good)
1. **From:** unknown/unexpected sender, outside org.
2. **To:** unexpected/bulk recipients.
3. **Date:** odd overnight timing (automation clue).
4. **Subject:** urgent/threatening language.
5. **Content:** pressure, sensitive-info requests, too-good-to-be-true.
6. **Hyperlinks:** hover to reveal real URL; misspelled domains.
7. **Attachments:** unexpected; risky types `.exe .js .zip .scr .vbs .bat .docm .xlsm .pptm`.
8. **✅ Good:** use Outlook **Report → Report Phishing** (1-click escalation to SOC).

#### A.9 Physical & Social Engineering — 7 habits
1. Don't tailgate through secure doors.
2. Never plug in unknown USB drives; report found drives to IT.
3. Beware shoulder surfing; use privacy screens.
4. Don't share access badges.
5. Practice clean-desk: no unattended sensitive docs/devices, lock screens.
6. Verify visitors/contractors/deliveries; follow escort procedure (factory areas included).
7. Report lost/stolen badges immediately.

#### A.10 Remote & Wi-Fi — 6 key tips
1. Use secure Wi-Fi networks (avoid public Wi-Fi for sensitive work).
2. Enable VPN — encrypt all remote connections.
3. Keep devices secure (passwords, MFA, updates).
4. Secure your home router (unique password, WPA2/WPA3, keep firmware current).
5. Be aware of phishing when remote.
6. Protect company data (no work files on personal devices/untrusted cloud).

#### A.11 FAQ — 12 Q&A summary
1. **Best passphrase:** 4 random words ≥16 chars.
2. **Unexpected Authenticator push:** deny, then email SOC to reset credentials.
3. **Breach exposure check:** built-in HIBP checker.
4. **Report phishing in Outlook:** ribbon button; else forward as attachment to `cic@midassafety.com`.
5. **Clicked a fake link:** disconnect, change password, email SOC for session revocation.
6. **Gift-card/wire email from manager:** BEC/CEO impersonation; verify by phone/Teams.
7. **Lock shortcut:** `Win + L`.
8. **Lost/stolen device:** report to SOC for remote wipe + token blocking.
9. **Why VPN on public Wi-Fi:** unencrypted networks → eavesdrop/MITM; VPN = encrypted tunnel.
10. **Home router hardening:** default admin password, WPA2-AES/WPA3, no remote admin, firmware updates.
11. **SOC vs CERT/Police:** corporate → SOC; personal/social → external.
12. **Reporting illegal Facebook/harassment (LK):** CID `dir.cid@police.gov.lk`; CCID takedowns `ccid.report@police.gov.lk`.

#### A.12 Security Tips — 12 tips
Top-5 flagged (TBD by author) among: phishing detection, passphrase strength, MFA enrollment, device locking, remote work hygiene, public Wi-Fi/VPN, USB-drop attacks, backups, updates, physical ID/badges, and reporting culture. Content per page `articlesData` — bullet and takeaway requirements mirror the source module rules above.

### B. Contact & Escalation Channel Inventory

| Channel | Type | Context |
|---|---|---|
| `cic@midassafety.com` | email (mailto) | SOC internal escalations (all pages) |
| `report@cert.gov.lk` | email | LK technical incidents |
| `socialmedia@cert.gov.lk` | email | LK social-media/unlawful content |
| `dir.cid@police.gov.lk` | email | LK CID cyber crime |
| `ccid.report@police.gov.lk` | email | LK CCID takedowns |
| `incidents@cirt.gov.bd` | email | BD technical incidents |
| `helpdesk@nccia.gov.pk` | email | PK incidents |
| `content-complaint@pta.gov.pk` | email | PK content complaints |
| **101** | tel | SL CERT hotline |
| **011 230 4518 / 4519** | tel | LK Cyber Crime Division |
| **011 2381058** | tel | LK Police CCID hotline |
| **01733 694162** | tel | BD CID Cyber Helpline |
| **+88 02 8181392** | tel | BD e-GOV CIRT hotline |
| **1799** | tel | PK NCCIA hotline |
| `telligp.police.lk`; `cirt.gov.bd/report-incident`; `complaint.nccia.gov.pk` | portal | Formal complaint portals |

### C. External URLs & APIs

- `https://api.pwnedpasswords.com/range/{prefix}` (HIBP, k-anonymity)
- `https://api.xposedornot.com/v1/check-email/{email}` (XposedOrNot)
- `https://haveibeenpwned.com/account/{email}`
- `https://myaccount.google.com/security-checkup`
- `https://mysignins.microsoft.com/security-info`
- `https://midassafety.sharepoint.com/sites/MidasSecurityHub` (hub home)
- `https://midassafety.sharepoint.com/sites/Intranet/PolicyDocuments/Midas%20Safety%20AI%20Policy_v1.pdf`
- SharePoint Stream video URLs (AI policy briefing) — 2 variants
- `https://fonts.googleapis.com` / `fonts.gstatic.com`
- `https://flagcdn.com` (flags for external-reporting)

---

*End of SRS — Midas Cyber Awareness & Security Hub v1.0 (Draft).*