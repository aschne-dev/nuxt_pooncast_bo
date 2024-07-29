<template>
  <div>
    <ul>
      <li v-for="episode in episodes" :key="episode.id">{{ episode.titre }}</li>
    </ul>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue';
import { usePooncastStore } from '@/stores/Pooncast';

const props = defineProps({
  seasonId: Number
});

const pooncastStore = usePooncastStore();

const episodes = computed(() => pooncastStore.episodesBySeason(props.seasonId));

watch(() => props.seasonId, async (newSeasonId) => {
  if (newSeasonId !== null) {
    await pooncastStore.fetchEpisodesBySeason(newSeasonId);
  }
});

onMounted(async () => {
  await pooncastStore.fetchEpisodesBySeason(props.seasonId);
});
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
