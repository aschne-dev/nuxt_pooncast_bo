<template>
  <div class="border-r-2 border-r-tertiary px-2">
    <ul>
        <li v-for="season in seasons" :key="season.id" class="flex justify-between items-center text-secondary pt-2">
         
          <div class="w-3/4">
            <span @click="selectSeason(season)" v-if="!isEditing(season)" class="ps-2 cursor-pointer"><span class="font-bold text-black">#{{ season.id }}</span> {{ season.title }}</span>
            <input v-else v-model="editTitle" class="ps-2" />

            <button v-if="isEditing(season)" @click="updateSeason(season.id)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </button> 
          </div> 


          <div class="w-1/4">
            <button @click="editSeason(season)" v-if="!isEditing(season)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </button>

            <button @click="confirmDeleteSeason(season.id)" v-if="!isEditing(season)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ps-2 w-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
         
        </li>
    </ul>

    <div class="mt-6 flex flex-col items-center size-full">
      <div class="border-t-2 border-t-secondary mb-3 w-2/3"></div>
      <form @submit.prevent="addNewSeason" class="flex flex-col size-full" >
        <textarea v-model="newSeasonTitle" type="text" placeholder="titre" rows="2" class="mb-2 rounded" />
        <button class="btn">Nouvelle saison</button>
      </form>
    </div>

  </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePodcastsSeasonStore } from '@/stores/PooncastSeason';

const newSeasonTitle = ref('');
const editTitle = ref('');
const editingSeasonId = ref(null);
const podcastsSeasonStore = usePodcastsSeasonStore();

const emit = defineEmits(['seasonSelected']);

onMounted(async () => {
  await podcastsSeasonStore.fetchSeasons();
});

const addNewSeason = async () => {
  if (newSeasonTitle.value) {
    await podcastsSeasonStore.addSeason(newSeasonTitle.value);
    newSeasonTitle.value = '';
  }
};

const editSeason = (season) => {
  editingSeasonId.value = season.id;
  editTitle.value = season.title;
};

const updateSeason = async (seasonId) => {
  await podcastsSeasonStore.updateSeason(seasonId, editTitle.value);
  editingSeasonId.value = null;
  editTitle.value = '';
};

const confirmDeleteSeason = (seasonId) => {
  if (window.confirm('ATTENTION, la saison ainsi que tous les épisodes relatifs vont être supprimés !! Continuez ?')) {
    deleteSeason(seasonId);
  }
};

const deleteSeason = async (seasonId) => {
  await podcastsSeasonStore.deleteSeason(seasonId);
};

const isEditing = (season) => editingSeasonId.value === season.id;

const selectSeason = (season) => {
  console.log('SEASON=' + season.id)
  emit('seasonSelected', season.id);
};

const seasons = computed(() => podcastsSeasonStore.seasons);
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
