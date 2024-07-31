<template>
  <div class="bg-tertiary rounded-lg shadow py-3 px-5 font-fraunces relative">
    <!-- UPDATE / DELETE -->
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

      <button v-else @click="updateReco" class="bg-green-600 px-3 py-3 rounded-full opacity-80 hover:bg-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
      </button>
    </div>

    <!-- FORMULAIRE DE MISE À JOUR -->
    <div>
      <!-- AVATAR -->
      <div class="flex items-center justify-center">
        <img :src="recommendation.avatar" :alt="recommendation.name" class="w-20">
        <input v-if="isUpdating" type="file" id="avatar" @change="handleFileChange" class="p-2 border border-gray-300 rounded" />
      </div>

      <!-- NOM -->
      <div class="flex gap-3 items-center justify-between">
        <p class="font-syne uppercase font-bold text-xl text-secondary">Nom</p>
        <p v-if="!isUpdating">{{ recommendation.name }}</p>
        <input v-else type="text" id="name" v-model="form.name" required class="w-3/4" />
      </div>

      <!-- PROFESSION -->
      <div class="flex gap-3 items-center justify-between">
        <p class="font-syne uppercase font-bold text-xl text-secondary">Profession</p>
        <p v-if="!isUpdating">{{ recommendation.profession }}</p>
        <input v-else type="text" id="profession" v-model="form.profession" required class="w-3/4 " />
      </div>

      <!-- NUMÉRO DE DÉPARTEMENT -->
      <div class="flex gap-3 items-center justify-between">
        <p class="font-syne uppercase font-bold text-xl text-secondary">Département</p>
        <p v-if="!isUpdating">{{ recommendation.departmentNumber }}</p>
        <input v-else type="number" id="departmentNumber" v-model="form.departmentNumber" required class="w-3/4" />
      </div>

      <!-- RECOMMANDATION -->
      <div class="flex gap-3 items-center">
        <p class="font-syne uppercase font-bold text-xl text-secondary">Recommandation</p>
        <p v-if="!isUpdating">{{ recommendation.recommendation }}</p>
        <textarea v-else id="recommendation" v-model="form.recommendation" required rows="4" class="w-3/4"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRecommendationsStore } from '@/stores/Reco/Recommendation'

const props = defineProps({
  recommendation: Object
})

const recommendationsStore = useRecommendationsStore()
const isUpdating = ref(false)
const isSubmitting = ref(false)

const form = ref({
  name: props.recommendation.name,
  profession: props.recommendation.profession,
  departmentNumber: props.recommendation.departmentNumber,
  recommendation: props.recommendation.recommendation,
  avatar: null
})

const startUpdating = () => {
  isUpdating.value = true
}

const stopUpdating = () => {
  isUpdating.value = false
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.avatar = file
  }
}

const updateReco = async () => {
  isSubmitting.value = true

  try {
    await recommendationsStore.updateRecommendation(props.recommendation.id, {
      name: form.value.name,
      profession: form.value.profession,
      departmentNumber: form.value.departmentNumber,
      recommendation: form.value.recommendation,
      avatar: props.recommendation.avatar,
      oldAvatar: form.value.avatar ? props.recommendation.avatar : null
    }, form.value.avatar)

    isUpdating.value = false
  } catch (error) {
    console.error('Error updating recommendation:', error)
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async () => {
  if (confirm(`Supprimer la recommandation de ${props.recommendation.name} ?`)) {
    await deleteReco()
  }
}

const deleteReco = async () => {
  try {
    await recommendationsStore.deleteRecommendation(props.recommendation.id)
  } catch (error) {
    console.error('Error deleting recommendation:', error)
  }
}
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
