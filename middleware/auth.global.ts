export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser();
 
  if (user) {
    if (to.name === 'login') {
      return navigateTo('/');
    }
  } else {
    if (to.name !== 'login') {
      return navigateTo('/login');
    }
  }
});
