import type { FullConfig } from '@playwright/test';

/**
 * Looks up the seeded material categories' real ids once per run, by
 * name, so specs never hard-code a UUID that a reseed would invalidate.
 * Values set on process.env here reach every test worker.
 */
const CATEGORIES = {
  E2E_E_WASTE_CATEGORY_ID: 'E-waste',
  E2E_GLASS_CATEGORY_ID: 'Glass',
} as const;

const globalSetup = async (config: FullConfig) => {
  const baseURL = config.projects[0]?.use.baseURL ?? 'http://localhost:3000';
  const res = await fetch(
    `${baseURL}/api/v1/categories/?module=materials&page_size=200`,
  );
  if (!res.ok) {
    throw new Error(
      `Could not list categories (${res.status}) — is the backend running?`,
    );
  }
  const { results } = (await res.json()) as {
    results: { id: string; name: string }[];
  };
  Object.entries(CATEGORIES).forEach(([envName, name]) => {
    const match = results.find((c) => c.name === name);
    if (!match) {
      throw new Error(
        `No "${name}" category — run python manage.py seed_all first.`,
      );
    }
    process.env[envName] = match.id;
  });
};

export default globalSetup;
