<template>
  <div class="-mt-52 flex flex-col justify-center items-center w-96">
    <div class="text-center"><img src="~assets/img/logo.png" alt="Logo Pooncast" class="w-40"></div>
    <form @submit.prevent="login">
      <div><input v-model="email" type="email" placeholder="Email"/></div>
      <div><input v-model="password" type="password" placeholder="Password" class="mt-2" /></div>
      <div class="text-center">
        <button class="btn mt-2" type="submit" :disabled="submitting">
          {{ submitting ? 'Vérification…' : 'Login' }}
        </button>
      </div>
    </form>
    <div class="flex" v-if="error">
      <p class="text-primary text-xs bg-red-600 px-5 py-3 mt-3 rounded">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { signInWithEmailAndPassword } from 'firebase/auth'
const auth = useFirebaseAuth() 
const route = useRoute();
const { authorizeBackOfficeUser } = useBoAuthorization();

const email = ref('');
const password = ref('');
const error = ref(
  route.query.reason === 'unauthorized'
    ? 'Vous n’êtes pas autorisé à accéder au back-office.'
    : ''
);
const submitting = ref(false);

const login = async () => {
  submitting.value = true;
  error.value = '';
  try {
    const credential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const authorized = await authorizeBackOfficeUser(credential.user, { force: true });
    if (!authorized) {
      error.value = 'Vous n’êtes pas autorisé à accéder au back-office.';
      return;
    }
    await navigateTo('/');
  } catch (_error) {
    error.value = 'Impossible de vous connecter.';
  } finally {
    submitting.value = false;
  }
};
</script>
