<template>
    <div class="mb-10">
        <div class="text-center mt-2 mb-5">
            <h1>Inscription Newsletter</h1>
            <nav class="flex gap-5 justify-center items-center mt-10">
            <button class="btn" @click="filter = 'all'"
            :class="{ 'text-black bg-tertiary' : filter == 'all'} ">Toutes les inscrits ({{ totalCount }})</button>
            <button class="btn" @click="filter = 'optin'"
            :class="{ 'text-black bg-tertiary' : filter == 'favs'} ">Optin ({{ optinCount }})</button>
            <button class="btn" @click="filter = 'optout'"
            :class="{ 'text-black bg-tertiary' : filter == 'theme'} ">Optout ({{ optoutCount }})</button>
          </nav>
        </div>

        <div v-if="loading" class="flex justify-center font-nunito"><p>Chargement en cours...</p></div>

        <div class="mx-10 mt-10" v-if="filter == 'all'">
            <div v-for="newsletter in newsletters" :key="newsletter.docid" class="mt-5">
                <NewsletterDetail :newsletter="newsletter" />
            </div>
        </div>

        <div class="mx-10 mt-10" v-if="filter == 'optin'">
            <div v-for="newsletter in optin" :key="newsletter.docid" class="mt-5">
                <NewsletterDetail :newsletter="newsletter" />
            </div>
        </div>

        <div class="mx-10 mt-10" v-if="filter == 'optout'">
            <div v-for="newsletter in optout" :key="newsletter.docid" class="mt-5">
                <NewsletterDetail :newsletter="newsletter" />
            </div>
        </div>
            
    </div>
</template>

<script setup>
import NewsletterDetail from './NewsletterDetail.vue';
import { useNewsletterStore } from '@/stores/Newsletter/newsletter';
const newsletterStore = useNewsletterStore();
const { newsletters, totalCount, optin, optinCount, optout, optoutCount, loading } = storeToRefs(newsletterStore);

onMounted(() => {
  newsletterStore.fetchNewsletter();
});

const filter = ref('all')

</script>

<style scoped>

</style>
