<template>
  <div class="mb-10">
    <div class="text-center mt-2 mb-5">
          <h1>Liste des Participations</h1>
          <nav class="flex gap-5 justify-center items-center mt-10">
            <button class="btn" @click="filter = 'all'"
            :class="{ 'text-black bg-tertiary' : filter == 'all'} ">Toutes les participations ({{ totalCount }})</button>
            <button class="btn" @click="filter = 'favs'"
            :class="{ 'text-black bg-tertiary' : filter == 'favs'} ">Participations favorites ({{ favCount }})</button>
            <button class="btn" @click="filter = 'theme'"
            :class="{ 'text-black bg-tertiary' : filter == 'theme'} ">Thème du formulaire de participations</button>
          </nav>
    </div>

    <div v-if="loading" class="flex justify-center font-nunito"><p>Chargement en cours...</p></div>

    

    <div class="mx-10 mt-10" v-if="filter == 'all'">
      <div class="text-lg text-secondary font-fraunces font-bold flex justify-center">Non traités ({{ newerCount }})</div>
      <div v-for="participation in newer" :key="participation.docid" class="mt-5">
        <ParticipationDetail :participation="participation" />
      </div>

      <div class="text-lg text-secondary font-fraunces font-bold flex justify-center mt-10">Traités ({{ processedCount }})</div>
      <div v-for="participation in processed" :key="participation.docid" class="mt-5">
        <ParticipationDetail :participation="participation" />
      </div>
    </div>

    <div class="mx-10 mt-10" v-else-if="filter === 'favs'">
      <div v-for="participation in favs" :key="participation.docid" class="mt-5">
        <ParticipationDetail :participation="participation" />
      </div>
    </div>

   <!-- THEME POUR LE FORMULAIRE PARTICIPATION-->
   <div v-else>
      <ParticipationTheme />
    </div>
    
  </div>
</template>

<script setup>
import ParticipationDetail from './ParticipationDetail.vue';
import ParticipationTheme from './ParticipationTheme.vue';
import { useParticipationsStore } from '@/stores/Participations/participation';

const participationsStore = useParticipationsStore();
const { processed, processedCount, newer, newerCount, totalCount, favs, favCount, loading } = storeToRefs(participationsStore);

participationsStore.fetchParticipations();

const filter = ref('all')
</script>