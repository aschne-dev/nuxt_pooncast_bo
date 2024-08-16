<template>
  <div class="mb-10">
      <div class="text-center mt-2 mb-5">
          <h1>Liste des Poonblog</h1>
          <div>
              <button v-if="!showAddBlog" class="btn mt-5" @click="showAddBlog = true">Ajouter un article</button>
              <button v-else class="btn mt-5" @click="showAddBlog = false">Fermer</button>
          </div>
      </div>

      <!-- ADD -->
      <div class="text-center mt-2 mb-5">
          <AddBlog v-if="showAddBlog"/>
      </div>


  </div>
</template>

<script setup>
import AddBlog from './AddBlog.vue';

const showAddBlog = ref(false);
</script>
