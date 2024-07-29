<template>
  <div class="flex flex-col">
    <div class=""><SeasonManagement @seasonSelected="handleSeasonSelected" /></div>
    <div class="bg-red-500"><PooncastManagement :seasonId="selectedSeasonId" /></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SeasonManagement from '@/components/SeasonManagement';
import PooncastManagement from '@/components/PooncastManagement';

const selectedSeasonId = ref(null);

const handleSeasonSelected = (seasonId) => {
  selectedSeasonId.value = seasonId;
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
