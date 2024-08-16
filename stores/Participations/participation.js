import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';


export const useParticipationsStore = defineStore({
  id: 'Participations',
  state: () => ({ 
    participations: [],
    loading: false,
    error: null
  }),
   
  getters: {
    totalCount: (state) => {
      return state.participations.length;
    },

    favs() {
        return this.participations.filter(t => t.fav)
    },
    favCount() {
        return this.participations.reduce((p, c) => {
            return c.fav ? p + 1 : p
        }, 0)
    },

    processed() {
        return this.participations.filter(t => t.status === 'processed')
    },

    processedCount() {
        return this.participations.reduce((p, c) => {
            return c.status === 'processed' ? p + 1 : p
        }, 0)
    },

    newer() {
        return this.participations.filter(t => t.status === 'new')
    },

    newerCount() {
        return this.participations.reduce((p, c) => {
            return c.status === 'new' ? p + 1 : p
        }, 0)
    }
  },
   
  actions: {
    async fetchParticipations() {
      this.loading = true;
      this.error = null;  // Réinitialise l'erreur à chaque nouvelle tentative

      const firestore = useFirestore();

      try {
        const participationsQuery = query(collection(firestore, 'participations'), orderBy('id', 'desc'));
        const snapshot = await getDocs(participationsQuery);
        
        if (snapshot.empty) {
          console.warn("No participations found.");
        }
        
        this.participations = snapshot.docs.map(doc => ({ ...doc.data(), docid: doc.id }));
      } catch (error) {
        console.error('Error fetching participations:', error);
        this.error = 'Error fetching participations';
      } finally {
        this.loading = false;
      }
    },

    async toggleFav(docid) {
        const firestore = useFirestore();
        const participation = this.participations.find(p => p.docid === docid);

        if (participation) {
            // Toggle the fav value locally
            participation.fav = participation.fav === 0 ? 1 : 0;

            try {
                // Update the fav field in Firestore
                const docRef = doc(firestore, 'participations', participation.docid);
                await updateDoc(docRef, {
                    fav: participation.fav
                });
            } catch (error) {
                console.error('Error updating fav:', error);
            }
        } else {
            console.warn(`Participation with id ${id} not found.`);
        }
    },

    async toggleProcessed(docid) {
        const firestore = useFirestore();
        const participation = this.participations.find(p => p.docid === docid);

        if (participation) {
            // Toggle the fav value locally
            participation.status = participation.status === 'new' ? 'processed' : 'new';

            try {
                // Update the fav field in Firestore
                const docRef = doc(firestore, 'participations', participation.docid);
                await updateDoc(docRef, {
                    status: participation.status
                });
            } catch (error) {
                console.error('Error updating fav:', error);
            }
        } else {
            console.warn(`Participation with id ${id} not found.`);
        }
    },

    async deleteParticipation(docid) {
        const firestore = useFirestore();
        const storage = getStorage();

        const participation = this.participations.find(p => p.docid === docid);

        if (participation) {
            try {
                // Delete the file from Firebase Storage
                const fileRef = storageRef(storage, participation.fileUrl);
                await deleteObject(fileRef);

                // Delete the document from Firestore
                const docRef = doc(firestore, 'participations', participation.docid);
                await deleteDoc(docRef);

                // Remove the participation from local state
                this.participations = this.participations.filter(p => p.docid !== docid);

            } catch (error) {
                console.error('Error deleting participation:', error);
            }
        } else {
            console.warn(`Participation with id ${docid} not found.`);
        }
    }
  }
});
