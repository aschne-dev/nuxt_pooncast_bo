<template>
    <div>
        <!-- LISTE -->
        <RecoList />

        <!-- AJOUT -->
        <AddReco />
    </div>
</template>

<script setup>
import AddReco from '~/components/Reco/AddReco.vue';
import RecoList from '~/components/Reco/RecoList.vue';
import { useRecommendationsStore } from '@/stores/Reco/Recommendation'

const recommendationsStore = useRecommendationsStore()

onMounted(async () => {
  await recommendationsStore.fetchRecommendations()
})

</script>

<style scoped>

</style>