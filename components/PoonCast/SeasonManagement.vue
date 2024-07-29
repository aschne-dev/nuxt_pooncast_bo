<template>
  <div>
    <div class="container px-5 pt-3 bg-tertiary rounded shadow-lg">
      <select v-model="selectedSeasonId" @change="handleSeasonChange" class="rounded my-2 text-xl px-2">
        <option v-for="season in seasonsWithEpisodeCounts" :key="season.id" :value="season.id">
          #{{ season.id }} {{ season.title }} ({{ season.episodeCount }})
        </option>
      </select>

      <div class="border-t-primary border-t-2 my-5 w-3/4"></div>

      <form @submit.prevent="addNewSeason" class="flex items-center pb-5">
        <input v-model="newSeasonTitle" type="text" placeholder="Ajouter une nouvelle saison" size="30" class="rounded text-xl" />
        <button class="ms-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </form>
    </div>

    <header v-if="selectedSeason" class="flex items-center justify-between px-5 py-6">
      <div>
        <h1 v-if="!isEditing(selectedSeason)" class="text-3xl">
          <span class="font-bold text-black">#{{ selectedSeason.id }}</span> {{ selectedSeason.title }}
          <span>({{ episodesCount }})</span>
        </h1>
        <input v-else v-model="editTitle" class="text-4xl text-secondary" size="35" />
      </div>

      <div>
        <button v-if="isEditing(selectedSeason)" @click="updateSeason(selectedSeason.id)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 mr-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </button>

        <button @click="addpooncast" v-if="!isEditing(selectedSeason)">
          <svg v-if="!showForm" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 ms-2 hover:text-secondary transition ease-in duration-100">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 ms-2 hover:text-secondary transition ease-in duration-100">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>

        <button @click="editSeason(selectedSeason)" v-if="!isEditing(selectedSeason)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 ms-2 hover:text-secondary transition ease-in duration-100">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </button>

        <button @click="confirmDeleteSeason(selectedSeason.id)" v-if="!isEditing(selectedSeason)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 ms-2 hover:text-secondary transition ease-in duration-100">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </header>

    <FormPooncast v-if="showForm" :seasonId="selectedSeasonId" @pooncastAdded="handlepooncastAdded" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usepooncastsSeasonStore } from '~/stores/Pooncast/PooncastSeason';
import { usePooncastStore } from '~/stores/Pooncast/Pooncast';
import FormPooncast from '../Pooncast/FormPooncast.vue';

const newSeasonTitle = ref('');
const editTitle = ref('');
const editingSeasonId = ref(null);
const selectedSeasonId = ref(null);
const showForm = ref(false);
const pooncastsSeasonStore = usepooncastsSeasonStore();
const pooncastStore = usePooncastStore();

const emit = defineEmits(['seasonSelected', 'pooncastAdded']);

onMounted(async () => {
  await pooncastsSeasonStore.fetchSeasons();
  await pooncastStore.fetchpooncasts();
  if (pooncastsSeasonStore.seasons.length > 0) {
    selectedSeasonId.value = pooncastsSeasonStore.seasons[0].id;
    handleSeasonChange();
  }
});

const addNewSeason = async () => {
  if (newSeasonTitle.value) {
    await pooncastsSeasonStore.addSeason(newSeasonTitle.value);
    newSeasonTitle.value = '';
    selectedSeasonId.value = pooncastsSeasonStore.seasons[pooncastsSeasonStore.seasons.length - 1].id;
    handleSeasonChange();
  }
};

const editSeason = (season) => {
  editingSeasonId.value = season.id;
  editTitle.value = season.title;
};

const updateSeason = async (seasonId) => {
  await pooncastsSeasonStore.updateSeason(seasonId, editTitle.value);
  editingSeasonId.value = null;
  editTitle.value = '';
};

const confirmDeleteSeason = (seasonId) => {
  if (window.confirm('ATTENTION, la saison ainsi que tous les épisodes relatifs vont être supprimés !! Continuez ?')) {
    deleteSeason(seasonId);
  }
};

const deleteSeason = async (seasonId) => {
  await pooncastsSeasonStore.deleteSeason(seasonId);
  if (pooncastsSeasonStore.seasons.length > 0) {
    selectedSeasonId.value = pooncastsSeasonStore.seasons[0].id;
    handleSeasonChange();
  } else {
    selectedSeasonId.value = null;
    episodesCount.value = 0;
  }
};

const isEditing = (season) => editingSeasonId.value === season.id;

const handleSeasonChange = () => {
  emit('seasonSelected', selectedSeasonId.value);
  const season = pooncastsSeasonStore.seasons.find(s => s.id === selectedSeasonId.value);
  if (season) {
    editTitle.value = season.title;
    editingSeasonId.value = null;
  }
};

const selectedSeason = computed(() => pooncastsSeasonStore.seasons.find(season => season.id === selectedSeasonId.value));

const seasons = computed(() => pooncastsSeasonStore.seasons);

const episodesCount = computed(() => pooncastStore.episodeCountBySeason(selectedSeasonId.value));

const seasonsWithEpisodeCounts = computed(() => {
  return seasons.value.map(season => ({
    ...season,
    episodeCount: pooncastStore.episodeCountBySeason(season.id),
  }));
});

const addpooncast = () => {
  showForm.value = !showForm.value;
};

const handlepooncastAdded = async () => {
  showForm.value = false;
  emit('pooncastAdded');
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
