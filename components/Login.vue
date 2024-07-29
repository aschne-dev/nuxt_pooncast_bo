<template>
  <div class="-mt-52 flex flex-col justify-center items-center w-96">
    <div class="text-center"><img src="~assets/img/logo.png" alt="Logo Pooncast" class="w-40"></div>
    <form @submit.prevent="login">
      <div><input v-model="email" type="email" placeholder="Email"/></div>
      <div><input v-model="password" type="password" placeholder="Password" class="mt-2" /></div>
      <div class="text-center"><button class="btn mt-2"  type="submit">Login</button></div>
    </form>
    <div class="flex" v-if="error">
      <p class="text-primary text-xs bg-red-600 px-5 py-3 mt-3 rounded">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { signInWithEmailAndPassword } from 'firebase/auth'
const auth = useFirebaseAuth() 

const email = ref('');
const password = ref('');
const error = ref('');

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    navigateTo('/')
  } catch (err) {
    error.value = err.message;
  }
};
</script>
