<template>
    <div>
        <div class="text-center mt-2">
        <h1>Liste des recommandations</h1>
        <button class="btn mt-3" @click="toggleAddReco">
            {{ showAddReco ? 'Annuler' : 'Ajouter une recommandation' }}
        </button>
        </div>
        <!-- ADD -->
        <transition name="collapse">
        <div v-if="showAddReco">
            <AddReco @recommendationAdded="handleRecommendationAdded"/>
        </div>
        </transition>
        
        <!-- LIST -->
        <div v-for="recommendation in recommendations" :key="recommendation.id">
        <RecoDetail :recommendation="recommendation" class="my-5 mx-5" />
        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { useRecommendationsStore } from '@/stores/Reco/Recommendation';
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

/* Transition pour l'effet collapse */
.collapse-enter-active, .collapse-leave-active {
transition: max-height 0.5s ease;
}
.collapse-enter, .collapse-leave-to {
max-height: 0;
overflow: hidden;
}
</style>
  