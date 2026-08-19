import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  DEFAULT_SAFETY_WINDOW_MS,
  createParticipationAudioClient,
  parseParticipationAudioResponse,
} from '../utils/participation-audio.js';

describe('participation audio client', () => {
  it('deduplicates requests and caches only in memory outside the expiry safety window', async () => {
    let calls = 0;
    let now = 1_000;
    const client = createParticipationAudioClient({
      now: () => now,
      async request() {
        calls += 1;
        return { url: 'https://storage.invalid/audio', expiresAt: new Date(now + 120_000).toISOString() };
      },
    });
    const [first, second] = await Promise.all([
      client.get('participation-1', 'user-1'),
      client.get('participation-1', 'user-1'),
    ]);
    assert.equal(calls, 1);
    assert.equal(first.url, second.url);
    await client.get('participation-1', 'user-1');
    assert.equal(calls, 1);
    now += 120_000 - DEFAULT_SAFETY_WINDOW_MS;
    await client.get('participation-1', 'user-1');
    assert.equal(calls, 2);
  });

  it('separates cache entries by authenticated user and supports forced renewal', async () => {
    let calls = 0;
    const client = createParticipationAudioClient({
      now: () => 1_000,
      async request() {
        calls += 1;
        return { url: `https://storage.invalid/audio-${calls}`, expiresAt: '2099-01-01T00:00:00.000Z' };
      },
    });
    await client.get('participation-1', 'user-1');
    await client.get('participation-1', 'user-2');
    await client.get('participation-1', 'user-1', { force: true });
    assert.equal(calls, 3);
  });

  it('does not cache a staging-short URL inside the safety window', async () => {
    let calls = 0;
    const client = createParticipationAudioClient({
      now: () => 1_000,
      async request() {
        calls += 1;
        return { url: 'https://storage.invalid/audio', expiresAt: '1970-01-01T00:00:31.000Z' };
      },
    });
    await client.get('participation-1', 'user-1');
    await client.get('participation-1', 'user-1');
    assert.equal(calls, 2);
  });

  it('rejects non-HTTPS, malformed, and expired responses', () => {
    assert.throws(
      () => parseParticipationAudioResponse({ url: 'http://storage.invalid/audio', expiresAt: '2099-01-01T00:00:00.000Z' }),
      /invalid_audio_response/u
    );
    assert.throws(
      () => parseParticipationAudioResponse({ url: 'https://storage.invalid/audio', expiresAt: 'invalid' }),
      /invalid_audio_response/u
    );
    assert.throws(
      () => parseParticipationAudioResponse({ url: 'https://storage.invalid/audio', expiresAt: '1970-01-01T00:00:00.000Z' }),
      /invalid_audio_response/u
    );
  });
});
