// stores/Reco/Recommendation.js
import { defineStore } from 'pinia'
import { useFirestore } from 'vuefire'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

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
    async addRecommendation(recommendation, avatarFile) {
      this.loading = true
      this.error = null
      const firestore = useFirestore()
      const storage = getStorage()

      try {
        let avatarUrl = ''

        if (avatarFile) {
          const avatarRef = storageRef(storage, `reco_avatar/${avatarFile.name}`)
          const snapshot = await uploadBytes(avatarRef, avatarFile)
          avatarUrl = await getDownloadURL(snapshot.ref)
        }

        const recommendationData = {
          ...recommendation,
          avatar: avatarUrl,
        }

        const docRef = await addDoc(collection(firestore, 'recommendations'), recommendationData)
        this.recommendations.push({ ...recommendationData, id: docRef.id })
        this.loading = false
      } catch (error) {
        console.error('Error adding recommendation:', error)
        this.error = 'Error adding recommendation'
        this.loading = false
      }
    },
    async updateRecommendation(id, updatedRecommendation, avatarFile) {
      this.loading = true
      this.error = null
      const firestore = useFirestore()
      const storage = getStorage()

      try {
        let avatarUrl = updatedRecommendation.avatar

        if (avatarFile) {
          // Supprimer l'ancienne image si une nouvelle a été téléchargée
          if (updatedRecommendation.oldAvatar) {
            const oldAvatarRef = storageRef(storage, updatedRecommendation.oldAvatar)
            await deleteObject(oldAvatarRef)
          }

          const avatarRef = storageRef(storage, `reco_avatar/${avatarFile.name}`)
          const snapshot = await uploadBytes(avatarRef, avatarFile)
          avatarUrl = await getDownloadURL(snapshot.ref)
        }

        const recommendationDoc = doc(firestore, 'recommendations', id)
        await updateDoc(recommendationDoc, { ...updatedRecommendation, avatar: avatarUrl })

        const index = this.recommendations.findIndex(r => r.id === id)
        if (index !== -1) {
          this.recommendations[index] = { ...updatedRecommendation, avatar: avatarUrl, id }
        }

        this.loading = false
      } catch (error) {
        console.error('Error updating recommendation:', error)
        this.error = 'Error updating recommendation'
        this.loading = false
      }
    },
    async deleteRecommendation(id) {
      this.loading = true
      this.error = null
      const firestore = useFirestore()
      const storage = getStorage()

      try {
        const recommendationDoc = doc(firestore, 'recommendations', id)
        const recommendation = this.recommendations.find(r => r.id === id)

        if (recommendation.avatar) {
          const avatarRef = storageRef(storage, recommendation.avatar)
          await deleteObject(avatarRef)
        }

        await deleteDoc(recommendationDoc)
        this.recommendations = this.recommendations.filter(r => r.id !== id)
        this.loading = false
      } catch (error) {
        console.error('Error deleting recommendation:', error)
        this.error = 'Error deleting recommendation'
        this.loading = false
      }
    }
  },
  getters: {
    allRecommendations: (state) => state.recommendations
  }
})
