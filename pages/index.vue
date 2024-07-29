<template>
  <div class="flex flex-col">
    <div class="text-center pt-6">
      <h1>Administration des Pooncast</h1>
    </div>

    <div class="grid grid-cols-3 pt-6">
      <div class="col-span-1 ps-2">
        <SeasonManagement @seasonSelected="handleSeasonSelected" />
      </div>

      <div class="col-span-2">
        <PooncastManagement :seasonId="selectedSeasonId" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedSeasonId = ref(1);

const handleSeasonSelected = (seasonId) => {
  selectedSeasonId.value = seasonId;
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
