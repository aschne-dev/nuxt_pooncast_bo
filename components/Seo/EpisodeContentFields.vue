<template>
  <fieldset class="mt-8 rounded-lg border border-secondary p-4">
    <legend class="px-2 font-bold text-xl">Contenu éditorial SEO de l’épisode</legend>

    <label :for="`${fieldId}-short-answer`" class="block font-bold">Réponse courte</label>
    <textarea
      :id="`${fieldId}-short-answer`"
      :value="modelValue.shortAnswer"
      rows="7"
      class="w-full rounded border border-gray-300 p-2"
      @input="updateRoot('shortAnswer', $event.target.value)"
    />

    <div class="mt-6">
      <div class="flex items-center justify-between gap-4">
        <h3 class="font-bold text-lg">Sections H2</h3>
        <button type="button" class="btn" @click="addSection">Ajouter une section</button>
      </div>
      <div v-for="(section, index) in modelValue.sections" :key="`section-${index}`" class="mt-4 rounded border border-gray-400 p-3">
        <div class="flex items-center justify-between gap-2">
          <p class="font-bold">Section {{ index + 1 }}</p>
          <div class="flex gap-2">
            <button type="button" class="rounded bg-gray-300 px-2 py-1" :disabled="index === 0" @click="moveSection(index, -1)">↑</button>
            <button type="button" class="rounded bg-gray-300 px-2 py-1" :disabled="index === modelValue.sections.length - 1" @click="moveSection(index, 1)">↓</button>
            <button type="button" class="rounded bg-red-600 px-2 py-1 text-white" @click="removeSection(index)">Supprimer</button>
          </div>
        </div>
        <label :for="`${fieldId}-section-title-${index}`" class="mt-2 block font-bold">H2</label>
        <input
          :id="`${fieldId}-section-title-${index}`"
          :value="section.title"
          type="text"
          class="w-full rounded border border-gray-300 p-2"
          @input="updateSection(index, 'title', $event.target.value)"
        />
        <label :for="`${fieldId}-section-content-${index}`" class="mt-2 block font-bold">Contenu</label>
        <textarea
          :id="`${fieldId}-section-content-${index}`"
          :value="section.content"
          rows="8"
          class="w-full rounded border border-gray-300 p-2"
          @input="updateSection(index, 'content', $event.target.value)"
        />
      </div>
    </div>

    <div class="mt-6">
      <div class="flex items-center justify-between gap-4">
        <h3 class="font-bold text-lg">À retenir</h3>
        <button type="button" class="btn" @click="addKeyFact">Ajouter un fait</button>
      </div>
      <div v-for="(fact, index) in modelValue.keyFacts" :key="`fact-${index}`" class="mt-3 flex gap-2">
        <input
          :value="fact"
          type="text"
          class="w-full rounded border border-gray-300 p-2"
          :aria-label="`Fait à retenir ${index + 1}`"
          @input="updateKeyFact(index, $event.target.value)"
        />
        <button type="button" class="rounded bg-red-600 px-3 py-2 text-white" @click="removeKeyFact(index)">Supprimer</button>
      </div>
    </div>

    <div class="mt-6">
      <h3 class="font-bold text-lg">Activité</h3>
      <label :for="`${fieldId}-activity-title`" class="mt-2 block font-bold">Titre</label>
      <input
        :id="`${fieldId}-activity-title`"
        :value="modelValue.activity.title"
        type="text"
        class="w-full rounded border border-gray-300 p-2"
        @input="updateActivity('title', $event.target.value)"
      />
      <label :for="`${fieldId}-activity-content`" class="mt-2 block font-bold">Contenu</label>
      <textarea
        :id="`${fieldId}-activity-content`"
        :value="modelValue.activity.content"
        rows="6"
        class="w-full rounded border border-gray-300 p-2"
        @input="updateActivity('content', $event.target.value)"
      />
    </div>
  </fieldset>
</template>

<script setup>
const props = defineProps({
  fieldId: { type: String, required: true },
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);
const publish = (patch) => emit('update:modelValue', { ...props.modelValue, ...patch });

const updateRoot = (field, value) => publish({ [field]: value });
const addSection = () => publish({ sections: [...props.modelValue.sections, { title: '', content: '' }] });
const removeSection = (index) => publish({ sections: props.modelValue.sections.filter((_, itemIndex) => itemIndex !== index) });
const updateSection = (index, field, value) => publish({
  sections: props.modelValue.sections.map((section, itemIndex) => itemIndex === index ? { ...section, [field]: value } : section),
});
const moveSection = (index, offset) => {
  const target = index + offset;
  if (target < 0 || target >= props.modelValue.sections.length) return;
  const sections = [...props.modelValue.sections];
  [sections[index], sections[target]] = [sections[target], sections[index]];
  publish({ sections });
};

const addKeyFact = () => publish({ keyFacts: [...props.modelValue.keyFacts, ''] });
const removeKeyFact = (index) => publish({ keyFacts: props.modelValue.keyFacts.filter((_, itemIndex) => itemIndex !== index) });
const updateKeyFact = (index, value) => publish({
  keyFacts: props.modelValue.keyFacts.map((fact, itemIndex) => itemIndex === index ? value : fact),
});
const updateActivity = (field, value) => publish({
  activity: { ...props.modelValue.activity, [field]: value },
});
</script>
