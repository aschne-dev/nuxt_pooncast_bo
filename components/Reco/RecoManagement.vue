<template>
    <div>
        <div class="text-center mt-2">
            <h1>Liste des recommandations</h1>
        </div>

        <!-- PREVIEW -->
        <div class="mx-5 my-5 bg-primary shadow">
            <RecoCarousel />
        </div>

        <!-- ADD -->
        <div class="text-center">
            <button class="btn mt-3" @click="toggleAddReco">
            {{ showAddReco ? 'Annuler' : 'Ajouter une recommandation' }}
            </button>

            <AddReco  v-if="showAddReco" @recommendationAdded="handleRecommendationAdded"/>
        </div>
        
        <!-- LIST -->
        <div v-for="recommendation in recommendations" :key="recommendation.id">
            <RecoDetail :recommendation="recommendation" class="my-5 mx-5" />
        </div>
    </div>
</template>
  
<script setup>
import { useRecommendationsStore } from '@/stores/Reco/Recommendation';
import RecoCarousel from './RecoCarousel.vue';
import RecoDetail from './RecoDetail.vue';
import AddReco from './AddReco.vue';

const recommendationsStore = useRecommendationsStore();
const { recommendations } = storeToRefs(recommendationsStore);

const showAddReco = ref(false);

const toggleAddReco = () => {
    showAddReco.value = !showAddReco.value;
};

const handleRecommendationAdded = () => {
    showAddReco.value = false
}

</script>

<style scoped>
/* Ajoutez vos styles ici */

</style>
  