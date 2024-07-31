<template>
  <div class="max-w-lg mx-auto mt-10 p-5 shadow rounded bg-primary font-syne">
    <form @submit.prevent="handleSubmit">
      <!-- Nom -->
      <div class="mb-4">
        <label for="name" class="block mb-1 font-bold text-lg">Nom</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          required
          class="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <!-- Profession -->
      <div class="mb-4">
        <label for="profession" class="block mb-1 font-bold text-lg">Profession</label>
        <input
          type="text"
          id="profession"
          v-model="form.profession"
          required
          class="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <!-- Numéro de département -->
      <div class="mb-4">
        <label for="departmentNumber" class="block mb-1 font-bold text-lg">Numéro de département</label>
        <input
          type="number"
          id="departmentNumber"
          v-model="form.departmentNumber"
          required
          class="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <!-- Avatar -->
      <div class="mb-4">
        <label for="avatar" class="block mb-1 font-bold text-lg">Avatar (image)</label>
        <input
          type="file"
          id="avatar"
          @change="handleFileChange"
          required
          class="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <!-- Recommandation -->
      <div class="mb-4">
        <label for="recommendation" class="block mb-1 font-bold text-lg">Recommandation</label>
        <textarea
          id="recommendation"
          v-model="form.recommendation"
          required
          rows="4"
          class="w-full p-2 border border-gray-300 rounded"
        ></textarea>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button
          type="submit"
          class="btn"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Ajout en cours...' : 'Soumettre' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRecommendationsStore } from '@/stores/Reco/Recommendation'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const recommendationsStore = useRecommendationsStore()

const form = ref({
  name: '',
  profession: '',
  departmentNumber: '',
  avatar: null,
  recommendation: ''
})

const isSubmitting = ref(false)
const emit = defineEmits(['recommendationAdded'])

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.avatar = file
  }
}

const handleSubmit = async () => {
  if (form.value.name && form.value.profession && form.value.departmentNumber && form.value.avatar && form.value.recommendation) {
    isSubmitting.value = true

    try {
      const storage = getStorage()
      const avatarRef = storageRef(storage, `avatars/${form.value.avatar.name}`)
      const snapshot = await uploadBytes(avatarRef, form.value.avatar)
      const avatarUrl = await getDownloadURL(snapshot.ref)

      await recommendationsStore.addRecommendation({
        name: form.value.name,
        profession: form.value.profession,
        departmentNumber: form.value.departmentNumber,
        recommendation: form.value.recommendation,
        avatar: avatarUrl
      })

      // Reset form fields
      form.value.name = ''
      form.value.profession = ''
      form.value.departmentNumber = ''
      form.value.avatar = null
      form.value.recommendation = ''

      emit('recommendationAdded')
      
    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      isSubmitting.value = false
    }
  } else {
    alert('Veuillez remplir tous les champs et importer une image.')
  }
}
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
