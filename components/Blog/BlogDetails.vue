<template>
    <div>
        <div class="flex items-center justify-between">
            <div class="bg-primary py-5 px-5 rounded-xl font-syne font-medium text-xl cursor-pointer w-full"
                @click="toggleShowAnswer">
                <div class="flex justify-between items-center font-bold">
                    {{ blog.title }}
                    <svg :class="{ 'origin-center rotate-90': isOpen }" class="transition-transform duration-200 ease-in" xmlns="http://www.w3.org/2000/svg" width="24" height="42" viewBox="0 0 24 42" fill="none">
                        <path d="M16.4669 21.1306L1.01979 5.93775C0.711067 5.66124 0.461888 5.32662 0.286999 4.95371C0.112111 4.58079 0.0150693 4.17716 0.00161851 3.7667C-0.0118323 3.35624 0.0585812 2.94729 0.208691 2.56407C0.358801 2.18085 0.585555 1.83115 0.875532 1.53566C1.16551 1.24017 1.51281 1.00491 1.89689 0.843796C2.28096 0.682678 2.69399 0.598987 3.11154 0.597671C3.52909 0.596355 3.94266 0.677444 4.32777 0.836139C4.71289 0.994835 5.06171 1.22791 5.35361 1.52156L5.42964 1.59635L23.0859 18.9578C23.6712 19.5336 24 20.3144 24 21.1285C24 21.9427 23.6712 22.7235 23.0859 23.2992L5.43387 40.6607C5.14903 40.9506 4.8089 41.1826 4.43292 41.3433C4.05694 41.504 3.65246 41.5903 3.24257 41.5972C2.83269 41.6041 2.42543 41.5316 2.04404 41.3838C1.66266 41.2359 1.31461 41.0156 1.01979 40.7355C0.724965 40.4553 0.489131 40.1208 0.325752 39.751C0.162373 39.3812 0.074649 38.9834 0.0675888 38.5802C0.0605285 38.1771 0.13427 37.7765 0.284604 37.4014C0.434937 37.0263 0.658918 36.684 0.943758 36.3941L1.01979 36.3193L16.4669 21.1306Z" fill="#FF774C"/>
                    </svg>
                </div>

                <collapse-transition>
                    <div v-if="isOpen" class="font-nunito text-base font-medium py-5 w-4/5">
                        <div><img :src="blog.visuel"/></div>
                        <div class="mt-5 font-bold text-xl">{{ blog.intro }}</div>
                        <div v-for="(chapter, index) in blog.chapters" :key="index" class="mt-10">
                            <div class="font-bold text-lg" v-html="chapter.name"></div>
                            <div class="mt-2" v-html="chapter.text"></div>
                        </div>
                    </div>
                </collapse-transition>
            </div>

            <div class="flex items-center justify-center gap-2 ml-2">
                <button class="bg-gray-400 px-3 py-3 rounded-full opacity-80 hover:bg-gray-600" @click="toggleEditBlog">
                    <svg v-if="!showEditBlog" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    <svg v-else class="size-6" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                    </svg>
                </button>

                <button  class="bg-red-600 px-3 py-3 rounded-full opacity-80 hover:bg-gray-600" @click="handleDelete">
                    <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path>
                    </svg>
                </button>
            </div>

            
        </div>

        <div v-if="showEditBlog">
            <AddBlog :blog="blog" @blogAdded="showEditBlog = false"/>
        </div>
    </div>
</template>

<script setup>
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue';
import { useBlogStore } from '@/stores/Blog/blog';
import AddBlog from './AddBlog.vue';
const blogStore = useBlogStore();

const props = defineProps({
  blog: Object,
  openBlogId: String,
});

const showEditBlog = ref(false);
const emit = defineEmits(['toggleBlog']);
const isOpen = computed(() => props.openBlogId === props.blog.id);

const toggleShowAnswer = () => {
  emit('toggleBlog', props.blog.id);
};

// DELETE
const handleDelete = async () => {
  const confirmed = confirm(`Supprimer l'article de ${props.blog.title} ?`);
  if (confirmed) {
    await blogStore.deleteBlog(props.blog.id);
  }
};

// EDIT
const toggleEditBlog = () => {
    showEditBlog.value = !showEditBlog.value
}
</script>

<style scoped>

</style>