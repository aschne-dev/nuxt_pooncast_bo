import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';


export const useNewsletterStore = defineStore({
  id: 'Newsletter',
  state: () => ({ 
    newsletters: [],
    loading: false,
    error: null
  }),
   
  getters: {
    totalCount: (state) => {
      return state.newsletters.length;
    },

    optin() {
        return this.newsletters.filter(n => n.optin)
    },
    optinCount() {
        return this.newsletters.reduce((p, c) => {
            return c.optin ? p + 1 : p
        }, 0)
    },

    optout() {
        return this.newsletters.filter(n => !n.optin)
    },

    optoutCount() {
        return this.newsletters.reduce((p, c) => {
            return c.optin ? p : p +1
        }, 0)
    },
  },
   
  actions: {
    async fetchNewsletter() {
      this.loading = true;
      this.error = null;  // Réinitialise l'erreur à chaque nouvelle tentative

      const firestore = useFirestore();

      try {
        const newsletterQuery = query(collection(firestore, 'newsletter'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(newsletterQuery);
        
        if (snapshot.empty) {
          console.warn("No Newsletter found.");
        }
        
        this.newsletters = snapshot.docs.map(doc => ({ ...doc.data(), docid: doc.id }));
      } catch (error) {
        console.error('Error fetching newsletter:', error);
        this.error = 'Error fetching newsletter';
      } finally {
        this.loading = false;
      }
    },
    }
});
