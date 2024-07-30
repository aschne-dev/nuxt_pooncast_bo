<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">    
    <Pooncast v-for="pooncast in episodes" :key="pooncast.id" :pooncastId="pooncast.id" />
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
  await pooncastStore.fetchPooncasts();
});
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
