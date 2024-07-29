<template>
  <div>
    <ul>
      <li v-for="episode in episodes" :key="episode.id">
        <Pooncast :pooncastId="episode.id" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { usePooncastStore } from '~/stores/Pooncast/Pooncast';

const props = defineProps({
  seasonId: Number
});

const pooncastStore = usePooncastStore();

const episodes = computed(() => pooncastStore.episodesBySeason(props.seasonId));

onMounted(async () => {
  await pooncastStore.fetchpooncasts();
});
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
