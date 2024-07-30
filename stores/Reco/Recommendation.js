// stores/useRecommendationsStore.js
import { defineStore } from 'pinia'
import { useFirestore } from 'vuefire'
import { collection, getDocs, addDoc } from 'firebase/firestore'

export const useRecommendationsStore = defineStore('recommendations', {
  state: () => ({
    recommendations: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchRecommendations() {
      this.loading = true
      this.error = null
      const firestore = useFirestore()

      try {
        const snapshot = await getDocs(collection(firestore, 'recommendations'))
        this.recommendations = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        this.loading = false
      } catch (error) {
        console.error('Error fetching recommendations:', error)
        this.error = 'Error fetching recommendations'
        this.loading = false
      }
    },
    async addRecommendation(recommendation) {
      this.loading = true
      this.error = null
      const firestore = useFirestore()

      try {
        const docRef = await addDoc(collection(firestore, 'recommendations'), recommendation)
        this.recommendations.push({ ...recommendation, id: docRef.id })
        this.loading = false
      } catch (error) {
        console.error('Error adding recommendation:', error)
        this.error = 'Error adding recommendation'
        this.loading = false
      }
    }
  },
  getters: {
    allRecommendations: (state) => state.recommendations
  }
})
