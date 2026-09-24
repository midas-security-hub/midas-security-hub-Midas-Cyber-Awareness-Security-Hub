const { expect } = require('@playwright/test');

/**
 * Captures console errors and page errors on a page so tests can assert
 * pages load without unhandled JS/console errors.
 * Returns an array; benign/known messages are filtered by shouldIgnoreConsoleError.
 */
function attachErrorCapture(page) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !shouldIgnoreConsoleError(msg.text())) {
      errors.push('[console.error] ' + msg.text());
    }
  });
  page.on('pageerror', (err) => {
    errors.push('[pageerror] ' + err.message);
  });
  return errors;
}

function shouldIgnoreConsoleError(text) {
  return (
    /autoplay/i.test(text) ||
    /muted/i.test(text) ||
    /media element/i.test(text) ||
    /failed to load resource: net::ERR/i.test(text) ||
    /favicon/i.test(text) ||
    /downloadable font/i.test(text) ||
    /fonts\.gstatic|fonts\.googleapis/i.test(text)
  );
}

async function expectNoConsoleErrors(errors) {
  expect(errors).toEqual([]);
}

/** Computes whether the page has any horizontal overflow at the current viewport. */
async function noHorizontalOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth <= doc.clientWidth + 1;
  });
}

async function countVisible(page, selector) {
  return page.locator(selector + ':visible').count();
}

/** Counts scripts inside a page (used to assert zero-JS embed variant). */
async function scriptCount(page) {
  return page.locator('script').count();
}

module.exports = {
  attachErrorCapture,
  expectNoConsoleErrors,
  noHorizontalOverflow,
  countVisible,
  scriptCount
};