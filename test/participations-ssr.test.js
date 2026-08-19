import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';

const configSource = await readFile(new URL('../nuxt.config.ts', import.meta.url), 'utf8');
const managementSource = await readFile(
  new URL('../components/Participations/ParticipationsManagement.vue', import.meta.url),
  'utf8'
);
const detailSource = await readFile(
  new URL('../components/Participations/ParticipationDetail.vue', import.meta.url),
  'utf8'
);

describe('participations direct-load safety', () => {
  it('renders only the participations route on the client', () => {
    assert.match(configSource, /["']\/participations["']\s*:\s*\{\s*ssr:\s*false\s*\}/u);
    assert.doesNotMatch(configSource, /defineNuxtConfig\(\{\s*ssr:\s*false/u);
  });

  it('defers the Firestore read until the authenticated client page mounts', () => {
    assert.match(
      managementSource,
      /onMounted\(\(\)\s*=>\s*\{\s*participationsStore\.fetchParticipations\(\);\s*\}\);/u
    );
  });

  it('does not preload participation audio during page initialization', () => {
    assert.doesNotMatch(detailSource, /onMounted\([^)]*loadAudio/u);
    assert.match(detailSource, /@click=["']loadAudio\(\)["']/u);
    assert.match(detailSource, /<audio controls preload=["']none["']/u);
  });
});
