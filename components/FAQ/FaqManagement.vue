<template>
    <div class="mb-10">
        <div class="text-center mt-2 mb-5">
            <h1>Liste des FAQ</h1>
            <div>
                <button v-if="!showAddFaq" class="btn mt-5" @click="showAddFaq = true">Ajouter une FAQ</button>
                <button v-else class="btn mt-5" @click="showAddFaq = false">Fermer</button>
            </div>
        </div>

         <!-- ADD -->
         <div class="text-center mt-2 mb-5">
            <AddFaq v-if="showAddFaq" @faqAdded="showAddFaq = false"/>
        </div>

        <!-- PREVIEW -->
        <div class="bg-secondary mx-5 px-5 py-5 rounded-xl">
            <div v-for="faq in faqs" :key="faq.id" class="my-5 grid grid-cols-4">
                <div class="mx-auto text-2xl col-span-1 flex items-center justify-center gap-5">
                    <div class="text-center">#{{ faq.order }}</div>
                    <div>
                        <button class="hover:scale-125 border border-primary rounded-full p-2" @click="handleOrder('up', faq)">
                        <svg class="size-6" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"></path>
                        </svg>
                        </button>

                        <button class="hover:scale-125 border border-primary rounded-full p-2 ml-2" @click="handleOrder('down', faq)">
                        <svg class="size-6" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"></path>
                        </svg>
                        </button>
                    </div>
                </div>
                <div class="col-span-3">
                    <FaqDetails :faq="faq" :open-faq-id="openFaqId" @toggleFaq="toggleFaq"/>
                </div>
            </div>
        </div>
       
    </div>
</template>

<script setup>
import AddFaq from './AddFaq.vue';
import FaqDetails from './FaqDetails.vue';
import { useFaqStore } from '@/stores/FAQ/faq';

const faqStore = useFaqStore();
const { faqs } = storeToRefs(faqStore);

faqStore.fetchFaqs();

const showAddFaq = ref(false);
const openFaqId = ref(null); // État centralisé pour l'ID de la FAQ ouverte

const toggleFaq = (id) => {
    openFaqId.value = openFaqId.value === id ? null : id;
};

const handleOrder = async (upOrDown, faq) => {
  let newOrder = faq.order;

  if (upOrDown === 'up') {
    newOrder --;
  } else {
    newOrder ++;
  }

  if(newOrder != 0 && newOrder <= faqs.value.length) {
    await faqStore.updateOrders(faq.id, newOrder, upOrDown);
    faqStore.fetchFaqs();
  }
}
</script>

<style scoped>
</style>
