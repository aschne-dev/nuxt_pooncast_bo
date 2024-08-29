<template>
  <div class="bg-secondary flex flex-col w-96 mx-auto p-4 relative">
    <div class="absolute flex items-center gap-2 z-10">
      <button v-if="!isUpdating" class="bg-gray-400 px-3 py-3 rounded-full opacity-80 hover:bg-primary" @click="startUpdating">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>

      <button v-if="isUpdating" class="bg-gray-400 px-3 py-3 rounded-full opacity-80 hover:bg-primary" @click="stopUpdating">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>

      <button v-if="!isUpdating" @click="confirmDelete" class="bg-red-600 px-3 py-3 rounded-full opacity-80 hover:bg-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>

      <button v-else @click="updatePooncast" class="bg-green-600 px-3 py-3 rounded-full opacity-80 hover:bg-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
      </button>
    </div>

    <!-- IMAGE -->
    <div class="relative">
      <img :src="pooncast.visuel" :alt="pooncast.titre" class="size-96" />
      <input v-if="isUpdating" type="file" @change="handleFileChange" class="absolute bottom-10" />
    </div>

    <!-- NUMERO EPISODE -->
    <div class="font-syne text-primary font-bold text-xl pt-10 flex gap-2">Episode 
      <p v-if="!isUpdating">{{ pooncast.episodeNumber }}</p>
      <input v-else v-model="episodeNumber" type="text" size="2" class="text-secondary" />    
    </div>

    <!-- TITRE-->
    <h3 class="font-syne text-black font-bold text-xl pt-2">
      <span v-if="!isUpdating">{{ pooncast.titre }}</span>
      <textarea v-else v-model="titre" type="text" rows="3" class="w-full" /> 
    </h3>

    <!-- DESCRIPTION-->
    <p class="font-nunito text-black pt-2 leading-6 font-normal flex-grow">
      <span v-if="!isUpdating" v-html="pooncast.description"></span>
      <textarea v-else v-model="description" rows="5" type="text" class="w-full" /> 
    </p>

    
    <!-- AUDIO FILE -->
    <div class="mt-5 mb-auto flex items-center justify-between w-full">
      <Player v-if="!isUpdating" :fluxRss="pooncast.audio.fluxRss" />
      <div v-else class="w-full">
        <label class="text-primary">Lien MP3:</label>
        <textarea v-model="fluxRss" :placeholder="pooncast.audio.fluxRss" rows="5" class="w-full" />
      </div>
    </div>

     <!-- PODCAST PLATFORMS LINKS  -->
     <div class="mt-5 mb-auto flex items-center justify-between w-full">
      <PlatformsPlayer v-if="!isUpdating" :pooncastAudio="pooncast.audio" :pooncastTitle="pooncast.titre" />
      <div v-else class="flex flex-col w-full">
        <label class="pt-3 text-primary">Spotify:</label>
        <textarea v-model="spotify" :placeholder="pooncast.audio.spotify" rows="3" />

        <label class="pt-3 text-primary">Apple:</label>
        <textarea v-model="apple" :placeholder="pooncast.audio.apple" rows="3" />        

        <label class="pt-3 text-primary">Amazon:</label>
        <textarea v-model="amazon" :placeholder="pooncast.audio.amazon" rows="3" />

        <label class="pt-3 text-primary">Podcast Addict:</label>
        <textarea v-model="podcastaddict" :placeholder="pooncast.audio.podcastaddict" rows="3" />
      </div>
    </div> 

    
  </div>
</template>

<script setup>
import { usePooncastStore } from '@/stores/Pooncast/Pooncast';
import Player from '@/components/Pooncast/Player.vue';
import PlatformsPlayer from './PlatformsPlayer.vue';

const props = defineProps({
  pooncastId: String
});

const pooncastsStore = usePooncastStore();
const pooncast = computed(() => pooncastsStore.pooncastById(props.pooncastId));
const isUpdating = ref(false);

// UPDATE MODEL
const episodeNumber = ref('');
const titre = ref('');
const description = ref('');
const fluxRss = ref('');
const spotify = ref('');
const apple = ref('');
const podcastaddict = ref('');
const amazon = ref('');
const visuel = ref(null);

// Initialiser les modèles de mise à jour avec les valeurs actuelles du pooncast
const initializeUpdateModels = () => {
  episodeNumber.value = pooncast.value.episodeNumber;
  titre.value = pooncast.value.titre;
  description.value = pooncast.value.description;
  fluxRss.value = pooncast.value.audio.fluxRss;
  spotify.value = pooncast.value.audio.spotify;
  apple.value = pooncast.value.audio.apple;
  podcastaddict.value = pooncast.value.audio.podcastaddict;
  amazon.value = pooncast.value.audio.amazon;
};

// Surveiller les changements dans pooncast et réinitialiser les modèles de mise à jour
watch(pooncast, () => {
  initializeUpdateModels();
}, { immediate: true });

const startUpdating = () => {
  isUpdating.value = true;
  initializeUpdateModels();
};

const stopUpdating = () => {
  isUpdating.value = false;
  // Logique pour enregistrer les changements si nécessaire
};

const updatePooncast = async () => {
  const updatedData = {
    episodeNumber: episodeNumber.value,
    titre: titre.value,
    description: description.value,
    audio: {
      fluxRss: fluxRss.value,
      spotify: spotify.value,
      apple: apple.value,
      podcastaddict: podcastaddict.value,
      amazon: amazon.value,
    },  
  };

  await pooncastsStore.updatePooncast(pooncast.value.id, updatedData, visuel.value);
  stopUpdating();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    visuel.value = file;
  }
};

const confirmDelete = async () => {
  if (confirm(`Supprimer le pooncast: "${pooncast.value.titre}"? `)) {
    await deletePooncast();
  }
};

const deletePooncast = async () => {
  const storage = getStorage();
  const firestore = useFirestore();
  
  // Delete the pooncast from Firestore
  await deleteDoc(doc(firestore, 'pooncasts', pooncast.value.id));
  
  // Delete the image from Firebase Storage
  const imageRef = storageRef(storage, pooncast.value.visuel);
  await deleteObject(imageRef);
  
  // Remove the pooncast from the store
  pooncastsStore.pooncasts = pooncastsStore.pooncasts.filter(p => p.id !== pooncast.value.id);
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
