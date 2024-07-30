<template>
  <div class="bg-primary flex flex-col w-96 mx-auto p-4 relative">
    <div class="absolute flex items-center gap-2 z-10">
      <button v-if="!isUpdating" class="bg-gray-400 px-3 py-3 rounded-full opacity-80 hover:bg-secondary" @click="startUpdating">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>

      <button v-if="isUpdating" class="bg-gray-400 px-3 py-3 rounded-full opacity-80 hover:bg-secondary" @click="stopUpdating">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>

      <button v-if="!isUpdating" @click="confirmDelete" class="bg-red-600 px-3 py-3 rounded-full opacity-80 hover:bg-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>

      <button v-else @click="updatePooncast" class="bg-green-600 px-3 py-3 rounded-full opacity-80 hover:bg-secondary">
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
    <div class="font-syne text-secondary font-bold text-xl pt-10 flex gap-2">Episode 
      <p v-if="!isUpdating">{{ pooncast.episodeNumber }}</p>
      <input v-else v-model="episodeNumber" type="text" size="2" />    
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
    <div class="mt-10 mb-auto flex items-center justify-between w-full">
      <button v-if="!isUpdating" @click="handleAudio" class="flex items-center border-black border-solid border rounded-full px-5 py-2 font-syne font-bold hover:bg-secondary transition-colors ease-in duration-100 shadow-lg">
        <span>Ecouter</span>
        <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" class="size-8 ml-2">
          <path d="M16 2C13.2311 2 10.5243 2.82109 8.22202 4.35943C5.91973 5.89777 4.12532 8.08427 3.06569 10.6424C2.00607 13.2006 1.72882 16.0155 2.26901 18.7313C2.80921 21.447 4.14258 23.9416 6.10051 25.8995C8.05845 27.8574 10.553 29.1908 13.2687 29.731C15.9845 30.2712 18.7994 29.9939 21.3576 28.9343C23.9157 27.8747 26.1022 26.0803 27.6406 23.778C29.1789 21.4757 30 18.7689 30 16C30 12.287 28.525 8.72601 25.8995 6.1005C23.274 3.475 19.713 2 16 2ZM23.447 16.895L11.447 22.895C11.2945 22.9712 11.1251 23.0072 10.9548 22.9994C10.7845 22.9917 10.619 22.9406 10.474 22.8509C10.329 22.7613 10.2093 22.636 10.1264 22.4871C10.0434 22.3381 9.99993 22.1705 10 22V10C10.0001 9.82961 10.0437 9.66207 10.1268 9.51327C10.2098 9.36448 10.3294 9.23936 10.4744 9.14981C10.6194 9.06025 10.7848 9.00921 10.955 9.00155C11.1252 8.99388 11.2946 9.02984 11.447 9.106L23.447 15.106C23.6129 15.1891 23.7524 15.3168 23.8498 15.4747C23.9473 15.6326 23.9989 15.8145 23.9989 16C23.9989 16.1855 23.9473 16.3674 23.8498 16.5253C23.7524 16.6832 23.6129 16.8109 23.447 16.894" fill="black"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 ml-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>

      <textarea v-else v-model="fluxRss" :placeholder="pooncast.fluxRss" rows="5" class="w-full" />
    </div>

    <audio ref="audioPlayer" :src="pooncast.fluxRss" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { usePooncastStore } from '@/stores/Pooncast/Pooncast';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { doc, deleteDoc } from 'firebase/firestore';

const props = defineProps({
  pooncastId: String
});

const pooncastsStore = usePooncastStore();
const pooncast = computed(() => pooncastsStore.pooncastById(props.pooncastId));
const audioPlayer = ref(null);
const isPlaying = ref(false);
const isUpdating = ref(false);

// UPDATE MODEL
const episodeNumber = ref('');
const titre = ref('');
const description = ref('');
const fluxRss = ref('');
const visuel = ref(null);

// Initialiser les modèles de mise à jour avec les valeurs actuelles du pooncast
const initializeUpdateModels = () => {
  episodeNumber.value = pooncast.value.episodeNumber;
  titre.value = pooncast.value.titre;
  description.value = pooncast.value.description;
  fluxRss.value = pooncast.value.fluxRss;
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
    fluxRss: fluxRss.value,
  };

  await pooncastsStore.updatePooncast(pooncast.value.id, updatedData, visuel.value);
  stopUpdating();
};

const handleAudio = () => {
  if (audioPlayer.value) {
    if (isPlaying.value) {
      audioPlayer.value.pause();
    } else {
      audioPlayer.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
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
