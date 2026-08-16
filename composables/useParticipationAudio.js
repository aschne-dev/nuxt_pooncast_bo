import { createParticipationAudioClient } from '~/utils/participation-audio';

let audioClient;

export function useParticipationAudio() {
  const auth = useFirebaseAuth();
  const config = useRuntimeConfig();

  if (!audioClient) {
    audioClient = createParticipationAudioClient({
      async request(participationId) {
        const user = auth.currentUser;
        const endpoint = config.public.participationAudioUrlEndpoint;
        if (!user || !endpoint) throw new Error('audio_unavailable');
        const token = await user.getIdToken();
        return $fetch(endpoint, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: { participationId },
        });
      },
    });
  }

  async function fetchParticipationAudio(participationId, options = {}) {
    const user = auth.currentUser;
    if (!user) throw new Error('audio_unauthorized');
    return audioClient.get(participationId, user.uid, options);
  }

  function invalidateParticipationAudio(participationId) {
    const user = auth.currentUser;
    if (user) audioClient.invalidate(participationId, user.uid);
  }

  return { fetchParticipationAudio, invalidateParticipationAudio };
}
