<template>
  <div>
    <div v-for="season in seasons" :key="season.id" class="bg-tertiary py-2 px-5 my-2 mx-10 rounded-xl flex justify-between items-center">
      <p>{{ season.title }}</p>
      <p>
        <button class="p-2 rounded-full opacity-80" @click="pooncastsSeasonStore.toggleParticipationFormVisible(season.id)">
          <svg  class="size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          :class="{ 'fill-secondary': season.participationFormVisible }">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>      
      </p>
    </div>
  </div>
</template>

<script setup>
import { usepooncastsSeasonStore } from '~/stores/Pooncast/PooncastSeason';

const pooncastsSeasonStore = usepooncastsSeasonStore();
const { seasons } = storeToRefs(pooncastsSeasonStore)
pooncastsSeasonStore.fetchSeasons();
</script>

<style>

</style>