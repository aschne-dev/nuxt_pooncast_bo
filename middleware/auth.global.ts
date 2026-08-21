export default defineNuxtRouteMiddleware(async (to) => {
  const {
    authorizeBackOfficeUser,
    clearAuthorization,
  } = useBoAuthorization();
  const user = await getCurrentUser();
  const isLoginRoute = to.name === 'login';

  if (!user) {
    clearAuthorization();
    if (!isLoginRoute) return navigateTo('/login');
    return;
  }

  const authorized = await authorizeBackOfficeUser(user);
  if (!authorized) {
    if (!isLoginRoute) {
      return navigateTo({ path: '/login', query: { reason: 'unauthorized' } });
    }
    return;
  }

  if (isLoginRoute) return navigateTo('/');
});
