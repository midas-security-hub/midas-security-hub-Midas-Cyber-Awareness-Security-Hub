# Midas AI Security Assistant — Secure Gemini Proxy (Cloudflare Worker)

This small **Cloudflare Worker** lets the FAQ page talk to Google Gemini without ever
exposing your API key in the browser or in the public GitHub repository.

The Gemini API key lives **only** on the server side (as a Cloudflare Worker Secret).

---

## Why a proxy?

Your site is hosted on GitHub Pages, which serves **static, public files**. If you embed a
Gemini API key directly into `faq.html`, anyone who opens the page can read it from the
browser's View-Source / DevTools, then abuse your quota and rack up charges on your account.

By routing requests through this worker, the key never reaches the browser.

---

## 1. Deploy the worker

Requires Node.js and the Cloudflare CLI (or Dash).

### Option A — via CLI (recommended)

```bash
cd ai-proxy
npm i -g wrangler            # if not installed
npx wrangler login
npx wrangler deploy
```

### Option B — via Cloudflare Dashboard

1. Go to **Workers & Pages → Create → Worker**.
2. Paste the contents of `src/index.js`.
3. Deploy.

---

## 2. Store the API key as a secret (NEVER commit it)

```bash
cd ai-proxy
npx wrangler secret put GEMINI_API_KEY
# paste your Gemini API key when prompted
```

The key now lives only in Cloudflare's encrypted secret store. It is **not** in any file
and is **never** sent to the browser.

---

## 3. Get your worker's public URL

After deploy you'll see a URL like:

```
https://midas-ai-proxy.YOUR_SUBDOMAIN.workers.dev
```

---

## 4. Point `faq.html` at your worker

Open `faq.html` and update the `AI_WORKER_URL` constant (inside the script at the bottom of
the page) to your worker URL. For example:

```js
const AI_WORKER_URL = "https://midas-ai-proxy.YOUR_SUBDOMAIN.workers.dev";
```

The page then POSTs `{ "prompt": "..." }` to this URL and renders the returned `reply`.

---

## Security & abuse notes

- The worker accepts only `POST` with a JSON `{ "prompt": "..." }`.
- Prompts are capped at 500 characters and output at 250 tokens to limit cost.
- Consider adding an **origin allow-list** (domain check) inside the worker if you later
  want to restrict which site can call it. See `src/index.js` for where to add it.
- **Rotate the key if it was ever shared or committed.** To rotate, generate a new one in
  [Google AI Studio](https://aistudio.google.com/apikey) and re-run `wrangler secret put
  GEMINI_API_KEY`.

---

## Local test

```bash
cd ai-proxy
npx wrangler dev
```

Then POST a test request:

```bash
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d "{\"prompt\":\"How do I create a strong 4-word passphrase?\"}"
```
