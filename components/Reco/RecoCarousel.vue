<template>
    <div>
        <div class="flex flex-col justify-center items-center">
            <Carousel 
            :items-to-show="3" 
            :transition="500"
            :wrap-around="true"
            v-model="currentSlide"
            class="w-1/2 h-full"
            >
                <Slide v-for="(recommendation, index) in recommendations" :key="recommendation.id">
                    <div class="flex items-center justify-center h-52 cursor-pointer" @click="slideTo(index)">
                        <img :src="recommendation.avatar" :alt="recommendation.name" 
                            class="size-28 rounded-full bg-secondary transition-all ease-in duration-150"
                        />
                    </div>
                </Slide>

                
            </Carousel>

            <div class="grid grid-cols-3 w-1/2 mt-5">
                <div class="col-span-1">
                </div>

                <div class="col-span-1 text-center relative">
                    <transition name="fade">
                    <div :key="activeRecommendation.id" class="absolute w-full h-full">
                        <p class="font-syne font-medium capitalize text-3xl">{{ activeRecommendation.name }}</p>
                        <p class="font-nunito">{{ activeRecommendation.profession }}, {{ activeRecommendation.departmentNumber }}</p>                    
                    </div>
                    </transition>
                </div>

                <div class="flex items-center justify-center">
                    <button @click="slideTo(currentSlide + 1)" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="65" viewBox="0 0 64 65" fill="none" class="hover:fill-secondary transition-colors ease-in duration-150">
                        <circle cx="32" cy="32.5977" r="31.5" stroke="black"/>
                        <path d="M37.8325 32.1691C37.9398 32.2829 38 32.4366 38 32.5967C38 32.7568 37.9398 32.9105 37.8325 33.0243L32.6911 38.4251C32.5814 38.5352 32.4357 38.597 32.284 38.5977C32.2082 38.5973 32.1331 38.582 32.0627 38.5526C31.9587 38.5067 31.87 38.4295 31.8077 38.3307C31.7454 38.232 31.7124 38.116 31.7128 37.9976V33.1968H26.5713C26.4198 33.1968 26.2745 33.1336 26.1673 33.021C26.0602 32.9085 26 32.7558 26 32.5967C26 32.4375 26.0602 32.2849 26.1673 32.1724C26.2745 32.0598 26.4198 31.9966 26.5713 31.9966H31.7128V27.1958C31.7124 27.0773 31.7454 26.9614 31.8077 26.8626C31.87 26.7638 31.9587 26.6866 32.0627 26.6407C32.1682 26.5975 32.2832 26.5865 32.3944 26.6091C32.5056 26.6317 32.6085 26.6868 32.6911 26.7683L37.8325 32.1691Z" fill="black"/>
                        </svg>
                    </button>
                </div>
            </div>        

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
    transform: scale(1.4);
}  

.fade-enter-active, .fade-leave-active {
  @apply transition-opacity duration-300 ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  @apply opacity-0;
}
.fade-enter-to, .fade-leave-from {
  @apply opacity-100;
}

</style>