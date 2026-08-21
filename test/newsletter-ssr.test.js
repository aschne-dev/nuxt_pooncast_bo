import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';

const configSource = await readFile(new URL('../nuxt.config.ts', import.meta.url), 'utf8');
const managementSource = await readFile(
  new URL('../components/Newsletter/NewsletterManagement.vue', import.meta.url),
  'utf8'
);
const middlewareSource = await readFile(new URL('../middleware/auth.global.ts', import.meta.url), 'utf8');

describe('newsletter direct-load safety', () => {
  it('renders only the newsletter route on the client', () => {
    assert.match(configSource, /["']\/newsletter["']\s*:\s*\{\s*ssr:\s*false\s*\}/u);
    assert.doesNotMatch(configSource, /defineNuxtConfig\(\{\s*ssr:\s*false/u);
  });

  it('defers the Firestore read until the authenticated client page mounts', () => {
    assert.match(
      managementSource,
      /onMounted\(\(\)\s*=>\s*\{\s*newsletterStore\.fetchNewsletter\(\);\s*\}\);/u
    );
  });

  it('keeps unauthenticated and unauthorized users behind the login redirect', () => {
    assert.match(middlewareSource, /const user\s*=\s*await getCurrentUser\(\)/u);
    assert.match(middlewareSource, /if\s*\(!user\)[\s\S]*navigateTo\(["']\/login["']\)/u);
    assert.match(
      middlewareSource,
      /const authorized\s*=\s*await authorizeBackOfficeUser\(user\)[\s\S]*if\s*\(!authorized\)[\s\S]*path:\s*["']\/login["']/u
    );
  });
});
