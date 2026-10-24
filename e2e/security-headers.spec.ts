import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Security headers (security audit M-11, L-1). The full CSP runs
 * Report-Only, so a violation doesn't break the page — this spec is what
 * proves the policy is clean before it's switched to enforcing.
 */

const visit = async (page: Page, path: string) => {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
};

const collectCspViolations = (page: Page) => {
  const violations: string[] = [];
  page.on('console', (msg) => {
    if (/Content Security Policy/i.test(msg.text())) {
      violations.push(msg.text());
    }
  });
  return violations;
};

test('pages send the CSP, permissions and robots headers', async ({
  request,
}) => {
  const home = await request.get('/');
  const csp = home.headers()['content-security-policy'];
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(home.headers()['content-security-policy-report-only']).toContain(
    "default-src 'self'",
  );
  expect(home.headers()['permissions-policy']).toContain('geolocation=(self)');

  const login = await request.get('/login');
  expect(login.headers()['x-robots-tag']).toContain('noindex');

  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /admin');
});

test('public and admin pages raise no CSP violations', async ({ page }) => {
  const violations = collectCspViolations(page);

  await visit(page, '/');
  await loginAs(page, 'admin');
  await visit(page, '/admin');
  await visit(page, '/admin/pickups');
  await visit(page, '/admin/blogs');

  expect(violations).toEqual([]);
});

test('driver pages raise no CSP violations', async ({ page }) => {
  const violations = collectCspViolations(page);
  await loginAs(page, 'qaDriver');
  await visit(page, '/driver');
  await visit(page, '/driver/pickups');
  expect(violations).toEqual([]);
});
