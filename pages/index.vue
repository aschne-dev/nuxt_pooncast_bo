<template>
  <div class="flex flex-col">
    <div><SeasonManagement @seasonSelected="handleSeasonSelected" /></div>
    <div class="bg-red-500"><PooncastManagement :seasonId="selectedSeasonId" /></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePooncastStore } from '~/stores/Pooncast/Pooncast';
import SeasonManagement from '@/components/Pooncast/SeasonManagement';
import PooncastManagement from '@/components/Pooncast/PooncastManagement';

const selectedSeasonId = ref(null);
const pooncastStore = usePooncastStore();

const handleSeasonSelected = (seasonId) => {
  selectedSeasonId.value = seasonId;
};

onMounted(async () => {
  await pooncastStore.fetchpooncasts();
});
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
