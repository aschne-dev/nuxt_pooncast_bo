<template>
    <div class="max-w-lg mx-auto mt-10 p-5 shadow rounded bg-primary font-syne text-start">
    <form @submit.prevent="handleSubmit">

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
          type="submit"
          class="btn"
        >{{ loading ? 'Ajout en cours...' : 'Ajouter' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useFaqStore } from '@/stores/FAQ/faq'

const faqStore = useFaqStore()
const { loading } = storeToRefs(faqStore)
const emit = defineEmits(['faqAdded'])

const form = ref({
  question: '',
  reponse: '',
})

const handleSubmit = async () => {
    if (form.value.question && form.value.reponse) {
        await faqStore.addFaq({
            question: form.value.question,
            reponse: form.value.reponse,
        })

        // Reset form fields
        form.value.question = ''
        form.value.reponse = ''

        emit('faqAdded')
    } else {
        alert('Veuillez remplir tous les champs et importer une image.')
    }
}
   
</script>

<style scoped>

</style>