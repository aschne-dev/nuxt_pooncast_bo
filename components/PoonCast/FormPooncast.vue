<template>
  <div class="mx-5 my-5 px-5 bg-primary font-fraunces rounded shadow">
    <form @submit.prevent="handleSubmit" class="flex flex-col">
      <label class="pt-3 text-secondary">Titre:</label>
      <input v-model="titre" type="text" placeholder="Titre" />

      <label class="pt-3 text-secondary">Description:</label>
      <textarea v-model="description" placeholder="Description" rows="5" />

      <label class="pt-3 text-secondary">Visuel:</label>
      <input type="file" @change="handleFileChange" />

      <label class="pt-3 text-secondary">Flux RSS:</label>
      <textarea v-model="fluxRss" placeholder="Flux RSS" rows="5" />

      <button class="btn my-3 text-black font-bold uppercase" :disabled="loading">
        <span v-if="loading">Adding...</span>
        <span v-else>Ajouter l'épisode</span>
      </button>
    </form>
    <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePooncastStore } from '~/stores/Pooncast/Pooncast';

const props = defineProps({
  seasonId: Number
});

const emit = defineEmits(['pooncastAdded']);

const titre = ref('');
const description = ref('');
const fluxRss = ref('');
const visuel = ref(null);

const pooncastStore = usePooncastStore();
const error = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    visuel.value = file;
  }
};

const handleSubmit = async () => {
  error.value = null;

  if (!titre.value || !description.value || !fluxRss.value || !visuel.value) {
    error.value = 'Veuillez remplir tous les champs.';
    return;
  }

  const pooncast = {
    saison: props.seasonId,
    titre: titre.value,
    description: description.value,
    fluxRss: fluxRss.value,
  };

  await pooncastStore.addPooncast(pooncast, visuel.value);

  if (!pooncastStore.error) {
    titre.value = '';
    description.value = '';
    fluxRss.value = '';
    visuel.value = null;
    emit('pooncastAdded');
  } else {
    error.value = 'Erreur lors de l\'ajout du pooncast';
  }
};

const loading = computed(() => pooncastStore.loading);
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
