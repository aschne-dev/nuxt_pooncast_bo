<template>
  <div class="mb-10">
      <div class="text-center mt-2 mb-5">
          <h1>Liste des Poonblog ({{ totalCount }})</h1>
          <div>
              <button v-if="!showAddBlog" class="btn mt-5" @click="showAddBlog = true">Ajouter un article</button>
              <button v-else class="btn mt-5" @click="showAddBlog = false">Fermer</button>
          </div>
      </div>

      <!-- ADD -->
      <div class="text-center mt-2 mb-5">
          <AddBlog v-if="showAddBlog" @blogAdded="showAddBlog = false"/>
      </div>

      <!-- LISTE DES BLOGS -->
      <div v-if="loading" class="flex justify-center font-nunito"><p>Chargement en cours...</p></div>
      <div v-else class="flex justify-center font-nunito"><p>&nbsp;</p></div>

      <div class="bg-secondary mx-5 px-5 py-5 rounded-xl">
        <div v-for="blog in blogs" :key="blog.id" class="my-5 grid grid-cols-4">
            <div class="mx-auto text-2xl col-span-1 flex items-center justify-center gap-5">
                <div class="text-center">#{{ blog.order }}</div>
                <div>
                    <button class="hover:scale-125 border border-primary rounded-full p-2" @click="handleOrder('down', blog)">
                    <svg class="size-6" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"></path>
                    </svg>
                    </button>

                    <button class="hover:scale-125 border border-primary rounded-full p-2 ml-2" @click="handleOrder('up', blog)">
                    <svg class="size-6" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"></path>
                    </svg>
                    </button>
                </div>
            </div>

            <div class="col-span-3">
                <BlogDetails :blog="blog" :open-blog-id="openBlogId" @toggleBlog="toggleBlog"/>
            </div>        
            
        </div>
      </div>


  </div>
</template>

<script setup>
import AddBlog from './AddBlog.vue';
import { useBlogStore } from '@/stores/Blog/blog';

const blogStore = useBlogStore();
const { blogs, loading, totalCount } = storeToRefs(blogStore);
blogStore.fetchBlogs();

const showAddBlog = ref(false);
const openBlogId = ref(null); // État centralisé pour l'ID du Blog ouvert

const toggleBlog = (id) => {
    openBlogId.value = openBlogId.value === id ? null : id;
};

const handleOrder = async (upOrDown, blog) => {
  let newOrder = blog.order;

  if (upOrDown === 'up') {
    newOrder --;
  } else {
    newOrder ++;
  }

  if(newOrder != 0 && newOrder <= blogs.value.length) {
    await blogStore.updateOrders(blog.id, newOrder, upOrDown);
    blogStore.fetchBlogs();
  }
}
</script>
