<template>
    <div>
      <RecoManagement />
    </div>
</template>

<script setup>
import RecoManagement from '~/components/Reco/RecoManagement.vue';
import { useRecommendationsStore } from '@/stores/Reco/Recommendation'

const recommendationsStore = useRecommendationsStore()

onMounted(async () => {
  await recommendationsStore.fetchRecommendations()
})

</script>

<style scoped>

</style>