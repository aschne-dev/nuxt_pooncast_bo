<template>
  <div class="mt-10 p-5 shadow rounded bg-primary font-syne text-start"
  :class="{ 'mx-10': !props.blog }">
    <form @submit.prevent="handleSubmit">

       <!-- TITRE -->
       <div class="mb-4 mt-5">
        <label for="title" class="block mb-1 font-bold text-lg">Titre public / historique</label>
        <p v-if="props.blog" class="mb-2 text-sm text-red-800">Protégé pendant l’édition : cette valeur détermine l’URL publique.</p>
        <textarea
          type="text"
          id="title"
          v-model="form.title"
          rows="2"
          required
          :disabled="Boolean(props.blog)"
          class="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <!-- VISUEL -->
      <div class="mb-4">
        <label class="block mb-1 font-bold text-lg">Visuel</label>
        <input type="file" @change="handleFileChange" />
        <div v-if="imagePreview" class="mt-2">
          <img :src="imagePreview" alt="Aperçu du visuel" class="max-w-full h-auto rounded" />
        </div>
      </div>

      <!-- INTRODUCTION -->
      <div class="mb-4">
        <label for="intro" class="block mb-1 font-bold text-lg">Introduction</label>
        <textarea
          type="text"
          id="intro"
          v-model="form.intro"
          rows="2"
          required
          class="w-full p-2 border border-gray-300 rounded"
        />
      </div>

       <!-- CHAPITRES -->
      <div class="mb-4 border border-black p-2 rounded-lg" v-for="(chapter, index) in form.chapters" :key="index">
        <div class="flex justify-between items-center">
          <p class="block mb-1 font-bold text-lg">Chapitre {{ index + 1 }}</p>
          <button v-if="index !== 0" type="button" class="bg-red-500 px-3 py-3 rounded-full opacity-80 hover:bg-gray-600" @click="confirmDeleteChapter(index)">
            <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path>
            </svg>
          </button>
        </div>
        <label :for="'chapter-name' + (index + 1)" class="block mb-1 font-bold">Nom</label>
        <input
          type="text"
          :id="'chapter-name' + (index + 1)"
          v-model="chapter.name"
          required
          class="w-full p-2 mb-2 border border-gray-300 rounded"
        />

        <label :for="'chapter' + (index + 1)" class="block mb-1 font-bold">Description</label>
        <!-- <textarea
          :id="'chapter' + (index + 1)"
          v-model="chapter.text"
          rows="15"
          required
          class="w-full p-2 border border-gray-300 rounded"
        />  -->

        <QuillEditor :id="'chapter' + (index + 1)" v-model:content="chapter.text" contentType="html" theme="snow" />
      </div>

      
      <div class="text-center">
        <button type="button" class="btn mt-2" @click="addChapter">Ajouter un chapitre</button>
      </div>

      <SeoCommonFields
        field-id="blog"
        v-model:seo-title="form.seoTitle"
        v-model:meta-description="form.metaDescription"
        v-model:faq="form.faq"
        v-model:related-content="form.relatedContent"
        :blogs="blogs"
        :pooncasts="pooncasts"
      />

       <!-- Submit Button -->
       <div class="text-center mt-10 w-full">
        <button v-if="!props.blog"
          type="submit"
          class="btn w-full bg-green-600"
        >{{ loading ? 'Ajout en cours...' : "Ajouter l'article" }}</button>
        <button v-else
          type="submit"
          class="btn w-full bg-green-600"
        >{{ loading ? 'Édition en cours...' : "Valider les modifications" }}</button>
      </div>
      <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>

    </form>
  </div>
</template>

<script setup>
import { QuillEditor } from '@vueup/vue-quill';
import "@vueup/vue-quill/dist/vue-quill.snow.css"

import { useBlogStore } from '@/stores/Blog/blog';
import { usePooncastStore } from '@/stores/Pooncast/Pooncast';
import { createEmptySeoFields, normalizeArticleEditorData } from '@/utils/seo-content';

const props = defineProps({
  blog: Object
});

const blogStore = useBlogStore();
const { loading } = storeToRefs(blogStore);
const { blogs } = storeToRefs(blogStore);
const pooncastStore = usePooncastStore();
const { pooncasts } = storeToRefs(pooncastStore);
const emit = defineEmits(['blogAdded'])

const emptySeoFields = createEmptySeoFields();
const form = ref({
  title: props.blog ? props.blog.title : '',
  intro: props.blog ? props.blog.intro : '',
  chapters: props.blog ? (props.blog.chapters || []).map((chapter) => ({ ...chapter })) : [{name:'', text: ''}],
  seoTitle: props.blog?.seoTitle || emptySeoFields.seoTitle,
  metaDescription: props.blog?.metaDescription || emptySeoFields.metaDescription,
  faq: (props.blog?.faq || emptySeoFields.faq).map((item) => ({ ...item })),
  relatedContent: (props.blog?.relatedContent || emptySeoFields.relatedContent).map((item) => ({ ...item })),
});

const error = ref(null);

onMounted(async () => {
  if (pooncasts.value.length === 0) {
    await pooncastStore.fetchPooncasts();
  }
});


// VISUEL
const visuel = ref(null);
const imagePreview = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    visuel.value = file;
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

// CHAPITRES
const addChapter = () => {
  form.value.chapters.push({ name: '', text: '' });
};

// Confirmer la suppression d'un chapitre
const confirmDeleteChapter = (index) => {
  const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer le chapitre " + (index +1)+" ?");
  if (confirmed) {
    deleteChapter(index);
  }
};

// Supprimer un chapitre
const deleteChapter = (index) => {
  form.value.chapters.splice(index, 1);
};


// SUBMIT
const handleSubmit = async () => {
  error.value = null;

  // Modifier le texte des chapitres pour ajouter les classes aux balises <ul> et <ol>
    form.value.chapters.forEach((chapter) => {
    chapter.text = chapter.text
      .replace(/<ul>/g, '<ul class="list-disc list-inside">')
      .replace(/<ol>/g, '<ol class="list-decimal list-inside">');
  });

  let blog;

  try {
    blog = normalizeArticleEditorData(form.value);
  } catch (validationError) {
    error.value = validationError.message;
    return;
  }
  
  //console.log("chapters:" + form.value.chapters[0].text)

  if (props.blog) {
    // Si un blog est en cours d'édition, appelez `editBlog`
    await blogStore.editBlog(props.blog.id, blog, visuel.value);
  } else {
    // Sinon, ajoutez un nouveau blog
    await blogStore.addBlog(blog, visuel.value);
  }

  if (!blogStore.error) {
    form.value.title = '',
    form.value.intro = '';
    form.value.chapters = [{name:'', text: ''}];
    Object.assign(form.value, createEmptySeoFields());
    visuel.value = null;
    imagePreview.value = null;
    blogStore.fetchBlogs();
    emit('blogAdded')
  } else {
    error.value = "Erreur lors de l'ajout de l'article";
  }
}


</script>
