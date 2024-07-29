<template>
  <div>
    <NuxtLayout />
  </div>
</template>

<script setup>
const user = useCurrentUser()

onMounted(() => {
  watch(user, (currentUser, previousUser) => {
      if(previousUser && !currentUser) {
        return navigateTo('/login', { replace: true })
      }
  })
})
</script>
