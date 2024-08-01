<template>
    <div>
        <div class="flex justify-center">
            <Carousel 
            :items-to-show="3" 
            :transition="500"
            :wrap-around="true"
            v-model="currentSlide"
            class=" w-1/2"
            >
                <Slide v-for="(recommendation, index) in recommendations" :key="recommendation.id">
                    <div class="flex items-center justify-center h-52 cursor-pointer" @click="slideTo(index)">
                        <img :src="recommendation.avatar" :alt="recommendation.name" 
                            class="size-24 rounded-full bg-secondary transition-all ease-in duration-150"
                        />
                    </div>
                </Slide>

                
            </Carousel>
        </div>

        <div class="bg-red-500 text-center py-2">
            <p>{{ activeRecommendation.name }}</p>
            <p>{{ activeRecommendation.profession }}, {{ activeRecommendation.departmentNumber }}</p>
            <button class="btn" @click="slideTo(currentSlide + 1)">next</button>
        </div>

    </div>
</template>

<script setup>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { useRecommendationsStore } from '@/stores/Reco/Recommendation'

const recommendationsStore = useRecommendationsStore()
const recommendations = computed(() => recommendationsStore.allRecommendations)
const activeRecommendation = ref('')

const currentSlide = ref(0);
const slideTo = (index) => { 
    currentSlide.value = index;
    updateActiveRecommendation()
}

const updateActiveRecommendation = () => {
    const currentIndex = currentSlide.value % recommendations.value.length
    //console.log("Current = "+ currentIndex)
    activeRecommendation.value = recommendations.value[currentIndex]
}

onMounted(async () => {
    await recommendationsStore.fetchRecommendations()
    await nextTick()
    slideTo(1)
})

</script>

<style scoped>
.carousel__slide--sliding {
  transition: 0.5s;
}

.carousel__slide--active {
    transform: scale(1.5);
}  

</style>