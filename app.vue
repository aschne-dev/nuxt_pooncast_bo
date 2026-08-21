<template>
  <div>
    <NuxtLayout />
  </div>
</template>

<script setup>
const user = useCurrentUser()
const { clearAuthorization } = useBoAuthorization()

onMounted(() => {
  watch(user, (currentUser, previousUser) => {
      if(previousUser && !currentUser) {
        clearAuthorization()
        return navigateTo('/login', { replace: true })
      }
  })
})
</script>
