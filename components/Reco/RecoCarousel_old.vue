<template>
    <div>
        <div class="bg-blue-500 flex justify-center">
            <vueper-slides
                ref="vueperslideavatar"
                @slide="handleSlideChange"
                :visible-slides="3"
                :infinite="false"
                :slide-multiple="false"
                :arrows-outside="false"
                fixed-height="208px"
                class=" w-96 h-52 no-shadow"
                :arrows="false"
                :bullets="false"
                
                >
                <vueper-slide v-for="(recommendation, index) in extendedRecommendations" :key="index" :title="recommendation.id">
                    <template #content>
                        <div class="flex items-center justify-center h-52" @click="vueperslideavatar.goToSlide(index)">
                            <img :src="recommendation.avatar" :alt="recommendation.name" 
                                class="size-24 rounded-full bg-secondary transition-all ease-in duration-150"
                            />
                        </div>
                </template>
                </vueper-slide>
                
            </vueper-slides>
        </div>
  
        <div class="bg-red-500 text-center py-2">
            <p>{{ activeRecommendation.name }}</p>
            <p>{{ activeRecommendation.profession }}, {{ activeRecommendation.departmentNumber }}</p>
            <button class="btn" @click="vueperslideavatar.next()">next</button>
        </div>

        <div v-for="recommendation in extendedRecommendations" :key="recommendation.id">
            {{  recommendation.name }}
        </div>

    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, nextTick } from 'vue'
  import { useRecommendationsStore } from '@/stores/Reco/Recommendation'
  import { VueperSlides, VueperSlide } from 'vueperslides'
  import 'vueperslides/dist/vueperslides.css'
  
  const recommendationsStore = useRecommendationsStore()
  const recommendations = computed(() => recommendationsStore.allRecommendations)
  const activeRecommendation = ref('')
  const extendedRecommendations = ref([])
  const vueperslideavatar = ref(null)
  
  
  const handleSlideChange = (params) => {
    
    const currentIndex = params.currentSlide.index
    const recommendationId = params.currentSlide.title
    const recommendation = recommendationsStore.getRecommendationById(recommendationId)
    if (recommendation) {
      activeRecommendation.value = recommendation
    }

    console.log("handleSlideChange=" + currentIndex)
    if( currentIndex === 0) {
        console.log("PREMIERE SLIDE");
        const lastReco = extendedRecommendations.value[(extendedRecommendations.value.length-1)];
        console.log("Slide a ajouter :" + JSON.stringify(lastReco));
        extendedRecommendations.value.unshift(lastReco);
        extendedRecommendations.value.pop();
    }

    if(currentIndex === extendedRecommendations.value.length - 2) {
        console.log("DERNIERE SLIDE");
        const firstReco = extendedRecommendations.value[0];
        extendedRecommendations.value.push(firstReco);
        extendedRecommendations.value.shift();
    }

    // Update extendedRecommendations for infinite effect
   /* if (currentIndex === extendedRecommendations.value.length - 2) {
        extendedRecommendations.value = [
        ...recommendations.value,
        recommendations.value[0]
        ]
        vueperslideavatar.value.goToSlide(1)
    } else if (currentIndex === 1) {
        extendedRecommendations.value = [
        recommendations.value[recommendations.value.length - 1],
        ...recommendations.value
        ]
        vueperslideavatar.value.goToSlide(recommendations.value.length - 1)
    }*/
  }
  
  
  onMounted(async () => {
    await recommendationsStore.fetchRecommendations()
    extendedRecommendations.value = [
        recommendations.value[recommendations.value.length - 1],
        ...recommendations.value,
        recommendations.value[0]
        ]    
    await nextTick()
    /*console.log('recommendations =' + extendedRecommendations.value.length )
    const nbSlideToGo = extendedRecommendations.value.length / 2;
    console.log('slideToGo =' + nbSlideToGo )*/
    vueperslideavatar.value.goToSlide(1)
    
  })
  </script>
  
<style scoped>
.vueperslide--active img {
    @apply size-32;
}  
</style>
  