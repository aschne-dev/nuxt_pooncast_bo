<template>
  <div class="mx-5 my-5 px-5 bg-primary font-fraunces rounded shadow">
    <form @submit.prevent="handleSubmit" class="flex flex-col">
      <label class="pt-3 text-secondary">Titre public / historique :</label>
      <p class="text-sm text-red-800">Ce titre déterminera l’URL publique de l’épisode.</p>
      <input v-model="titre" type="text" placeholder="Titre" />

      <label class="pt-3 text-secondary">Description:</label>
      <textarea v-model="description" placeholder="Description" rows="5" />

      <label class="pt-3 text-secondary">Visuel:</label>
      <input type="file" @change="handleFileChange" />

      <label class="pt-3 text-secondary">Lien MP3:</label>
      <textarea v-model="fluxRss" placeholder="Lien MP3 (lecture sur le site pour plus tard)" rows="2" />

      <label class="pt-3 text-secondary">Spotify:</label>
      <textarea v-model="spotify" placeholder="Lien Spotify" rows="2" />

      <label class="pt-3 text-secondary">Apple:</label>
      <textarea v-model="apple" placeholder="Lien Apple" rows="2" />      

      <label class="pt-3 text-secondary">Amazon:</label>
      <textarea v-model="amazon" placeholder="Lien Amazon" rows="2" />

      <label class="pt-3 text-secondary">Podcast Addict:</label>
      <textarea v-model="podcastaddict" placeholder="Lien Podcast Addict" rows="2" />

      <SeoCommonFields
        field-id="new-pooncast"
        v-model:seo-title="seoFields.seoTitle"
        v-model:meta-description="seoFields.metaDescription"
        v-model:faq="seoFields.faq"
        v-model:related-content="seoFields.relatedContent"
        :blogs="blogs"
        :pooncasts="pooncasts"
      />

      <SeoEpisodeContentFields field-id="new-pooncast" v-model="seoContent" />

      <button class="btn my-3 text-black font-bold uppercase" :disabled="loading">
        <span v-if="loading">Adding...</span>
        <span v-else>Ajouter l'épisode</span>
      </button>
    </form>
    <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
  </div>
</template>

<script setup>
import { usePooncastStore } from '~/stores/Pooncast/Pooncast';
import { useBlogStore } from '~/stores/Blog/blog';
import {
  createEmptyEpisodeSeoContent,
  createEmptySeoFields,
  normalizeEpisodeEditorData,
} from '~/utils/seo-content';

const props = defineProps({
  seasonId: Number
});

const emit = defineEmits(['pooncastAdded']);

const titre = ref('');
const description = ref('');
const fluxRss = ref('');
const spotify = ref('');
const apple = ref('');
const podcastaddict = ref('');
const amazon = ref('');
const visuel = ref(null);

const pooncastStore = usePooncastStore();
const { pooncasts } = storeToRefs(pooncastStore);
const blogStore = useBlogStore();
const { blogs } = storeToRefs(blogStore);
const error = ref(null);
const seoFields = ref(createEmptySeoFields());
const seoContent = ref(createEmptyEpisodeSeoContent());

onMounted(async () => {
  if (blogs.value.length === 0) {
    await blogStore.fetchBlogs();
  }
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    visuel.value = file;
  }
};

const handleSubmit = async () => {
  error.value = null;

  if (!titre.value || !description.value || !fluxRss.value || !spotify.value || !apple.value || !podcastaddict.value || !amazon.value || !visuel.value) {
    error.value = 'Veuillez remplir tous les champs.';
    return;
  }

  let pooncast;

  try {
    pooncast = normalizeEpisodeEditorData({
      saison: props.seasonId,
      titre: titre.value,
      description: description.value,
      audio: {
        fluxRss: fluxRss.value,
        spotify: spotify.value,
        apple: apple.value,
        podcastaddict: podcastaddict.value,
        amazon: amazon.value,
      },
      ...seoFields.value,
      seoContent: seoContent.value,
    });
  } catch (validationError) {
    error.value = validationError.message;
    return;
  }

  await pooncastStore.addPooncast(pooncast, visuel.value);

  if (!pooncastStore.error) {
    titre.value = '';
    description.value = '';
    fluxRss.value = '',
    spotify.value = '';
    apple.value = '';
    podcastaddict.value = '';
    amazon.value = '';
    visuel.value = null;
    seoFields.value = createEmptySeoFields();
    seoContent.value = createEmptyEpisodeSeoContent();
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
