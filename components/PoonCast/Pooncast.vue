<template>
  <div>
    <h1>{{ pooncast.titre }}</h1>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePooncastStore } from '@/stores/Pooncast/Pooncast';

const props = defineProps({
  pooncastId: String
});

const pooncastsStore = usePooncastStore();
const pooncast = computed(() => pooncastsStore.pooncastById(props.pooncastId));
</script>

<style scoped>
</style>