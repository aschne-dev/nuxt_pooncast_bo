<template>
  <fieldset class="mt-8 rounded-lg border border-secondary p-4">
    <legend class="px-2 font-bold text-xl">SEO et contenus associés</legend>

    <div class="mb-5">
      <label :for="`${fieldId}-seo-title`" class="block font-bold">SEO title</label>
      <input
        :id="`${fieldId}-seo-title`"
        :value="seoTitle"
        type="text"
        class="w-full rounded border border-gray-300 p-2"
        placeholder="Titre destiné aux moteurs de recherche"
        @input="$emit('update:seoTitle', $event.target.value)"
      />
      <p class="mt-1 text-sm" :class="seoTitleLength > 65 ? 'text-orange-700' : 'text-gray-700'">
        {{ seoTitleLength }} caractères · repère indicatif : 50–65
      </p>
    </div>

    <div class="mb-6">
      <label :for="`${fieldId}-meta-description`" class="block font-bold">Meta description</label>
      <textarea
        :id="`${fieldId}-meta-description`"
        :value="metaDescription"
        rows="4"
        class="w-full rounded border border-gray-300 p-2"
        placeholder="Description destinée aux moteurs de recherche"
        @input="$emit('update:metaDescription', $event.target.value)"
      />
      <p class="mt-1 text-sm" :class="metaDescriptionLength > 165 ? 'text-orange-700' : 'text-gray-700'">
        {{ metaDescriptionLength }} caractères · repère indicatif : 140–165
      </p>
    </div>

    <div class="mb-6">
      <div class="flex items-center justify-between gap-4">
        <h3 class="font-bold text-lg">FAQ visible</h3>
        <button type="button" class="btn" @click="addFaq">Ajouter une question</button>
      </div>

      <div v-for="(item, index) in faq" :key="`faq-${index}`" class="mt-4 rounded border border-gray-400 p-3">
        <div class="flex items-center justify-between gap-2">
          <p class="font-bold">Question {{ index + 1 }}</p>
          <div class="flex gap-2">
            <button type="button" class="rounded bg-gray-300 px-2 py-1" :disabled="index === 0" @click="moveFaq(index, -1)">↑</button>
            <button type="button" class="rounded bg-gray-300 px-2 py-1" :disabled="index === faq.length - 1" @click="moveFaq(index, 1)">↓</button>
            <button type="button" class="rounded bg-red-600 px-2 py-1 text-white" @click="removeFaq(index)">Supprimer</button>
          </div>
        </div>
        <label :for="`${fieldId}-faq-question-${index}`" class="mt-2 block font-bold">Question</label>
        <input
          :id="`${fieldId}-faq-question-${index}`"
          :value="item.question"
          type="text"
          class="w-full rounded border border-gray-300 p-2"
          @input="updateFaq(index, 'question', $event.target.value)"
        />
        <label :for="`${fieldId}-faq-answer-${index}`" class="mt-2 block font-bold">Réponse</label>
        <textarea
          :id="`${fieldId}-faq-answer-${index}`"
          :value="item.answer"
          rows="4"
          class="w-full rounded border border-gray-300 p-2"
          @input="updateFaq(index, 'answer', $event.target.value)"
        />
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between gap-4">
        <h3 class="font-bold text-lg">Contenus associés</h3>
        <button type="button" class="btn" @click="addRelatedContent">Ajouter un lien</button>
      </div>
      <p class="mt-1 text-sm text-gray-700">Les liens sont résolus à partir du titre historique et de l’ID Firestore.</p>

      <div v-for="(item, index) in relatedContent" :key="`related-${index}`" class="mt-3 grid gap-2 rounded border border-gray-400 p-3 md:grid-cols-[10rem_1fr_auto]">
        <select :value="item.type" class="rounded border border-gray-300 p-2" @change="updateRelatedType(index, $event.target.value)">
          <option value="blog">Article</option>
          <option value="pooncast">Épisode</option>
        </select>
        <select :value="item.id" class="rounded border border-gray-300 p-2" @change="updateRelatedId(index, $event.target.value)">
          <option value="">Sélectionner un contenu</option>
          <option v-for="option in optionsFor(item.type)" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
        </select>
        <button type="button" class="rounded bg-red-600 px-3 py-2 text-white" @click="removeRelatedContent(index)">Supprimer</button>
      </div>
    </div>
  </fieldset>
</template>

<script setup>
const props = defineProps({
  fieldId: { type: String, required: true },
  seoTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  faq: { type: Array, default: () => [] },
  relatedContent: { type: Array, default: () => [] },
  blogs: { type: Array, default: () => [] },
  pooncasts: { type: Array, default: () => [] },
});

const emit = defineEmits([
  'update:seoTitle',
  'update:metaDescription',
  'update:faq',
  'update:relatedContent',
]);

const seoTitleLength = computed(() => props.seoTitle.length);
const metaDescriptionLength = computed(() => props.metaDescription.length);

const optionsFor = (type) => (type === 'blog' ? props.blogs : props.pooncasts).map((item) => ({
  id: item.id,
  label: type === 'blog' ? item.title : item.titre,
}));

const addFaq = () => emit('update:faq', [...props.faq, { question: '', answer: '' }]);
const removeFaq = (index) => emit('update:faq', props.faq.filter((_, itemIndex) => itemIndex !== index));
const updateFaq = (index, field, value) => {
  const next = props.faq.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item);
  emit('update:faq', next);
};
const moveFaq = (index, offset) => {
  const target = index + offset;
  if (target < 0 || target >= props.faq.length) return;
  const next = [...props.faq];
  [next[index], next[target]] = [next[target], next[index]];
  emit('update:faq', next);
};

const addRelatedContent = () => emit('update:relatedContent', [...props.relatedContent, { type: 'blog', id: '' }]);
const removeRelatedContent = (index) => emit('update:relatedContent', props.relatedContent.filter((_, itemIndex) => itemIndex !== index));
const updateRelatedType = (index, type) => {
  const next = props.relatedContent.map((item, itemIndex) => itemIndex === index ? { type, id: '' } : item);
  emit('update:relatedContent', next);
};
const updateRelatedId = (index, id) => {
  const next = props.relatedContent.map((item, itemIndex) => itemIndex === index ? { ...item, id } : item);
  emit('update:relatedContent', next);
};
</script>
