// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      participationAudioUrlEndpoint:
        process.env.NUXT_PUBLIC_PARTICIPATION_AUDIO_URL_ENDPOINT || "",
    },
  },
  app: {
    head: {
      title: "Admin Pooncast",
    },
  },
  nitro: {
    firebase: {
      gen: 2,
      nodeVersion: "22",
      httpsOptions: {
        region: "europe-west1",
      },
      serverFunctionName: "server_bo",
    },
  },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "nuxt-vuefire"],

  // Vuefire
  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: false,
    },
    config: {
      apiKey: process.env.NUXT_FIREBASE_API_KEY,
      authDomain: process.env.NUXT_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NUXT_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NUXT_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_FIREBASE_APP_ID,
    },
  },

  routeRules: {
    "/": { ssr: false },
    "/login": { ssr: false },
    "/newsletter": { ssr: false },
    "/participations": { ssr: false },
    "/reco": { ssr: false },
    "/faq": { ssr: false },
    "/blog": { ssr: false },
  },
});
