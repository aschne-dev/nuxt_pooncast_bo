<template>
  <!-- <div>
    <button @click="handleAudio" class="flex items-center border-black border-solid border rounded-full px-5 py-2 font-syne font-bold hover:bg-secondary transition-colors ease-in duration-100 shadow-lg">
      <span>Ecouter</span>
      <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" class="size-8 ml-2">
        <path d="M16 2C13.2311 2 10.5243 2.82109 8.22202 4.35943C5.91973 5.89777 4.12532 8.08427 3.06569 10.6424C2.00607 13.2006 1.72882 16.0155 2.26901 18.7313C2.80921 21.447 4.14258 23.9416 6.10051 25.8995C8.05845 27.8574 10.553 29.1908 13.2687 29.731C15.9845 30.2712 18.7994 29.9939 21.3576 28.9343C23.9157 27.8747 26.1022 26.0803 27.6406 23.778C29.1789 21.4757 30 18.7689 30 16C30 12.287 28.525 8.72601 25.8995 6.1005C23.274 3.475 19.713 2 16 2ZM23.447 16.895L11.447 22.895C11.2945 22.9712 11.1251 23.0072 10.9548 22.9994C10.7845 22.9917 10.619 22.9406 10.474 22.8509C10.329 22.7613 10.2093 22.636 10.1264 22.4871C10.0434 22.3381 9.99993 22.1705 10 22V10C10.0001 9.82961 10.0437 9.66207 10.1268 9.51327C10.2098 9.36448 10.3294 9.23936 10.4744 9.14981C10.6194 9.06025 10.7848 9.00921 10.955 9.00155C11.1252 8.99388 11.2946 9.02984 11.447 9.106L23.447 15.106C23.6129 15.1891 23.7524 15.3168 23.8498 15.4747C23.9473 15.6326 23.9989 15.8145 23.9989 16C23.9989 16.1855 23.9473 16.3674 23.8498 16.5253C23.7524 16.6832 23.6129 16.8109 23.447 16.894" fill="black"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 ml-2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    </button>

    <div class="flex items-center mt-2">
      <span>{{ formattedCurrentTime }}</span>
      <input
        type="range"
        min="0"
        :max="duration"
        v-model="currentTime"
        @input="seekAudio"
        class="w-full mx-2"
      />
      <span>{{ formattedDuration }}</span>
    </div>

    <audio ref="audioPlayer" :src="fluxRss" @timeupdate="updateProgress" @loadedmetadata="setDuration" />

  </div> -->
  <div class="border-black border-solid border rounded-lg px-5 py-2 font-syne font-bold w-full">
    <div class="flex items-center justify-center">
      <span @click="handleAudio" class="cursor-pointer hover:text-secondary transition-colors ease-in duration-150">Ecouter</span>
      <button v-if="!isPlaying" @click="handleAudio">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="size-8 ml-2 hover:fill-secondary transition-colors ease-in duration-150">
          <path d="M16 2C13.2311 2 10.5243 2.82109 8.22202 4.35943C5.91973 5.89777 4.12532 8.08427 3.06569 10.6424C2.00607 13.2006 1.72882 16.0155 2.26901 18.7313C2.80921 21.447 4.14258 23.9416 6.10051 25.8995C8.05845 27.8574 10.553 29.1908 13.2687 29.731C15.9845 30.2712 18.7994 29.9939 21.3576 28.9343C23.9157 27.8747 26.1022 26.0803 27.6406 23.778C29.1789 21.4757 30 18.7689 30 16C30 12.287 28.525 8.72601 25.8995 6.1005C23.274 3.475 19.713 2 16 2ZM23.447 16.895L11.447 22.895C11.2945 22.9712 11.1251 23.0072 10.9548 22.9994C10.7845 22.9917 10.619 22.9406 10.474 22.8509C10.329 22.7613 10.2093 22.636 10.1264 22.4871C10.0434 22.3381 9.99993 22.1705 10 22V10C10.0001 9.82961 10.0437 9.66207 10.1268 9.51327C10.2098 9.36448 10.3294 9.23936 10.4744 9.14981C10.6194 9.06025 10.7848 9.00921 10.955 9.00155C11.1252 8.99388 11.2946 9.02984 11.447 9.106L23.447 15.106C23.6129 15.1891 23.7524 15.3168 23.8498 15.4747C23.9473 15.6326 23.9989 15.8145 23.9989 16C23.9989 16.1855 23.9473 16.3674 23.8498 16.5253C23.7524 16.6832 23.6129 16.8109 23.447 16.894"/>
        </svg>
      </button>

      <button v-else @click="handleAudio">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 ml-2 hover:fill-secondary transition-colors ease-in duration-150">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>
    </div>

    <div class="flex items-center justify-center gap-3 mt-2">
      <span class="w-8 font-nunito text-xs font-normal">{{ formattedCurrentTime }}</span>
      <input
        type="range"
        min="0"
        :max="duration"
        v-model="currentTime"
        @input="seekAudio"
        class="range-slider mx-2"
      />
      <span class="w-8 font-nunito text-xs font-normal">{{ formattedDuration }}</span>
      <audio ref="audioPlayer" :src="fluxRss" @timeupdate="updateProgress" @loadedmetadata="setDuration" />
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  fluxRss: String
});

const isPlaying = ref(false);
const audioPlayer = ref(null);
const currentTime = ref(0);
const duration = ref(0);

const handleAudio = () => {
  if (audioPlayer.value) {
    if (isPlaying.value) {
      audioPlayer.value.pause();
    } else {
      audioPlayer.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
};

const updateProgress = () => {
  if (audioPlayer.value) {
    currentTime.value = audioPlayer.value.currentTime;
  }
};

const setDuration = () => {
  if (audioPlayer.value) {
    duration.value = audioPlayer.value.duration;
  }
};

const seekAudio = () => {
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = currentTime.value;
  }
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const formattedCurrentTime = computed(() => formatTime(currentTime.value));
const formattedDuration = computed(() => formatTime(duration.value));
</script>

<style scoped>
.range-slider {
  -webkit-appearance: none;
  height: 8px;
  background: #FFB7A0;
  border-radius: 5px;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.range-slider:hover {
  opacity: 1;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #FF774C;
  cursor: pointer;
}

.range-slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #FF774C;
  cursor: pointer;
}

.range-slider::-ms-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #FF774C;
  cursor: pointer;
}
</style>
