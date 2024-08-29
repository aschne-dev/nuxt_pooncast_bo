<template>
  <div class="border-primary border-solid border rounded-lg px-5 py-5 font-syne font-bold w-full">
    <div class="flex items-center justify-center space-x-8">
      <NuxtLink :to="pooncastAudio.spotify" target="_blank" title="Spotify">
        <img src="@/assets/img/logo_spotify.svg" class="size-12" :alt="'Lien Spotify du pooncast ' + pooncastTitle" />
      </NuxtLink>

      <NuxtLink :to="pooncastAudio.apple" target="_blank" title="Apple Podcast">
        <img src="@/assets/img/logo_applepodcast.svg" class="size-12" :alt="'Lien Apple Podcast du pooncast ' + pooncastTitle" />
      </NuxtLink>

      <NuxtLink :to="pooncastAudio.podcastaddict" target="_blank" title="Podcast Addict">
        <img src="@/assets/img/logo_podcastaddict.svg" class="size-12" :alt="'Lien Podcast Addict du pooncast ' + pooncastTitle" />
      </NuxtLink>

      <NuxtLink :to="pooncastAudio.amazon" target="_blank" title="Amazon Music">
        <img src="@/assets/img/logo_amazon.svg" class="size-12" :alt="'Lien Amazon Music du pooncast ' + pooncastTitle" />
      </NuxtLink>
    </div>   
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  pooncastAudio: {
    type: Object,
    default: () => ({
      spotify: '',
      apple: '',
      podcastaddict: '',
      amazon: ''
    })
  },
  pooncastTitle: String
});

</script>

<style scoped>

</style>
