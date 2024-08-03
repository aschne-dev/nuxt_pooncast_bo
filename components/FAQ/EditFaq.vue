<template>
  <div>
    <div class="mt-5 p-5 shadow rounded bg-primary font-syne text-start">
        <!-- Question -->
        <div class="mb-4">
          <label for="question" class="block mb-1 font-bold text-lg">Question</label>
          <textarea
            type="text"
            id="question"
            v-model="form.question"
            rows="2"
            required
            class="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <!-- Reponse -->
        <div class="mb-4">
          <label for="reponse" class="block mb-1 font-bold text-lg">Réponse</label>
          <textarea
            type="text"
            id="reponse"
            v-model="form.reponse"
            rows="5"
            required
            class="w-full p-2 border border-gray-300 rounded"
          />
        </div>


        <!-- Submit Button -->
        <div class="text-center">
          <button
            class="btn"
            @click="handleUpdate"
          >{{ loading ? 'Modif en cours...' : 'Modifier' }}</button>
        </div>
     
    </div>
  </div>

</template>

<script setup>
import { useFaqStore } from '@/stores/FAQ/faq';
const faqStore = useFaqStore();
const { loading } = storeToRefs(faqStore)

const props = defineProps({
  faq: Object,
});

const emit = defineEmits(['faqUpdated'])

const form = ref({
  question: props.faq.question,
  reponse: props.faq.reponse,
})

const handleUpdate = async () => {
  if (form.value.question && form.value.reponse) {
    await faqStore.updateFaq(props.faq.id, {
      question: form.value.question,
      reponse: form.value.reponse,
    });
    emit('faqUpdated');
  } else {
    alert('Veuillez remplir tous les champs.');
  }
};

</script>

<style scoped>

</style>