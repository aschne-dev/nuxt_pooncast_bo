const DEFAULT_SAFETY_WINDOW_MS = 60_000;

function cacheKey(participationId, scope) {
  return `${scope}:${participationId}`;
}

export function parseParticipationAudioResponse(value, now = Date.now) {
  if (!value || typeof value !== 'object') throw new Error('invalid_audio_response');
  const expiresAtMs = Date.parse(value.expiresAt);
  let url;
  try {
    url = new URL(value.url);
  } catch (_error) {
    throw new Error('invalid_audio_response');
  }
  if (url.protocol !== 'https:' || !Number.isFinite(expiresAtMs) || expiresAtMs <= now()) {
    throw new Error('invalid_audio_response');
  }
  return { url: url.toString(), expiresAt: new Date(expiresAtMs).toISOString(), expiresAtMs };
}

export function createParticipationAudioClient(options) {
  const request = options.request;
  const now = options.now || Date.now;
  const safetyWindowMs = options.safetyWindowMs ?? DEFAULT_SAFETY_WINDOW_MS;
  const cache = new Map();
  const pending = new Map();

  async function get(participationId, scope, requestOptions = {}) {
    const key = cacheKey(participationId, scope);
    if (requestOptions.force) cache.delete(key);
    if (!requestOptions.force) {
      const cached = cache.get(key);
      if (cached && cached.expiresAtMs - now() > safetyWindowMs) return cached;
      cache.delete(key);
      if (pending.has(key)) return pending.get(key);
    }

    const operation = Promise.resolve(request(participationId))
      .then((response) => parseParticipationAudioResponse(response, now))
      .then((audio) => {
        if (audio.expiresAtMs - now() > safetyWindowMs) cache.set(key, audio);
        return audio;
      })
      .finally(() => pending.delete(key));
    pending.set(key, operation);
    return operation;
  }

  function invalidate(participationId, scope) {
    cache.delete(cacheKey(participationId, scope));
  }

  return { get, invalidate };
}

export { DEFAULT_SAFETY_WINDOW_MS };
