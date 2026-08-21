<template>
  <nav class="font-fraunces text-xl px-4 py-4">
    <div class="flex flex-col justify-center">
      <NuxtLink class="flex justify-center" to="/"><img src="~assets/img/logo.png" alt="Logo Pooncast" class="w-40"></NuxtLink>
      
      <div class="bg-secondary text-white px-3 py-2 rounded-md text-sm shadow-xl -mt-2 mb-6 flex flex-col justify-center items-center">
        <div class="text-center">{{ userDetails.firstname }}</div>
        <p class="text-xs font-syne cursor-pointer uppercase mt-3 px-2 bg-primary text-black text-center rounded shadow hover:bg-red-700 hover:text-white transition ease-out duration-300"
        @click="handleLogout">logout</p>
      </div>
    </div>
    
    <ul class="gap-4 ps-6">
      <li><NuxtLink to="/" class="text-secondary">Pooncast</NuxtLink></li>
      <li><NuxtLink to="/participations" class="text-secondary">Participations</NuxtLink></li>
      <li><NuxtLink to="/newsletter" class="text-secondary">Newsletter</NuxtLink></li>
      <li><NuxtLink to="/reco" class="text-secondary">Recommandations</NuxtLink></li>
      <li><NuxtLink to="/faq" class="text-secondary">FAQ</NuxtLink></li>
      <li><NuxtLink to="/blog" class="text-secondary">PoonBlog</NuxtLink></li>
    </ul>

  </nav>
</template>

<script setup>
const { authorizationProfile, logoutBackOfficeUser } = useBoAuthorization();
const userDetails = computed(() => authorizationProfile.value || {});

const handleLogout = async () => {
  await logoutBackOfficeUser();
  await navigateTo('/login');
};

</script>

<style scoped>
 .router-link-exact-active {
    @apply font-bold;
  }

</style>
