<template>
  <div>
    <h2>Episodes for Season {{ seasonId }}</h2>
    <ul>
      <li v-for="episode in episodes" :key="episode.id">{{ episode.titre }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { usePooncastStore } from '@/stores/Pooncast';

const props = defineProps({
  seasonId: Number
});

const episodes = ref([]);
const podcastsStore = usePooncastStore();

const fetchEpisodes = async (seasonId) => {
  await podcastsStore.fetchEpisodesBySeason(seasonId);
  episodes.value = podcastsStore.episodes;
};

watch(() => props.seasonId, async (newSeasonId) => {
  if (newSeasonId !== null) {
    await fetchEpisodes(newSeasonId);
  }
});

onMounted(async () => {
  await fetchEpisodes(props.seasonId);
});
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
