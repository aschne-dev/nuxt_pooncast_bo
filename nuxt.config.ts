import auth from "./middleware/auth.global";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Le PoonCast | Admin',
    },
  },
  modules: [
    "@nuxtjs/tailwindcss", 
    "@pinia/nuxt",
    "nuxt-vuefire"
  ],

  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: false
    },
    config: {
      apiKey: "AIzaSyApjYoK5Q86zJ2zHnX1Pcq3xkLenRns7bc",
      authDomain: "lepooncast-aec97.firebaseapp.com",
      projectId: "lepooncast-aec97",
      storageBucket: "lepooncast-aec97.appspot.com",
      messagingSenderId: "895460708454",
      appId: "1:895460708454:web:4b79d540588b315d299da7"
    },
  },

  routeRules: {
    '/': { ssr: false },
    '/login': { ssr: false },
    '/reco' : { ssr: false },
    '/faq' : { ssr: false }
  }
  
})