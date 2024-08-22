// stores/PooncastSeason.js
import { defineStore } from 'pinia';
import { useFirestore } from 'vuefire';
import { collection, getDocs, query, orderBy, limit, doc, setDoc, deleteDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const usepooncastsSeasonStore = defineStore('pooncastsSeason', {
  state: () => ({
    seasons: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalCount: (state) => {
      return state.seasons.length;
    },
    
    // Nouveau getter pour obtenir le nom d'une saison à partir de son ID
    seasonNameById: (state) => {
      return (id) => {
        const season = state.seasons.find(season => season.id === id);
        return season ? season.title : 'Autre';
      };
    }
  },


  actions: {
    async fetchSeasons() {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();

      try {
        const snapshot = await getDocs(query(collection(firestore, 'seasons'), orderBy('id', 'asc')));
        this.seasons = snapshot.docs.map(doc => doc.data());
        this.loading = false;
      } catch (error) {
        console.error('Error fetching seasons: ', error);
        this.error = 'Error fetching seasons';
        this.loading = false;
      }
    },
    async addSeason(title) {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();

      try {
        const lastSeasonSnapshot = await getDocs(query(collection(firestore, 'seasons'), orderBy('id', 'desc'), limit(1)));
        let newId = 1;
        if (!lastSeasonSnapshot.empty) {
          newId = lastSeasonSnapshot.docs[0].data().id + 1;
        }

        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User is not authenticated');
        }

        const newSeason = {
          id: newId,
          title: title,
          createdAt: new Date(),
          userId: user.uid,
          participationFormVisible: false
        };

        await setDoc(doc(collection(firestore, 'seasons'), String(newId)), newSeason);
        this.seasons.push(newSeason);
        this.loading = false;
      } catch (error) {
        console.error('Error adding season: ', error);
        this.error = 'Error adding season';
        this.loading = false;
      }
    },
    async updateSeason(seasonId, newTitle) {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();

      try {
        const seasonRef = doc(firestore, 'seasons', String(seasonId));
        await setDoc(seasonRef, { title: newTitle }, { merge: true });
        const seasonIndex = this.seasons.findIndex(season => season.id === seasonId);
        if (seasonIndex !== -1) {
          this.seasons[seasonIndex].title = newTitle;
        }
        this.loading = false;
      } catch (error) {
        console.error('Error updating season: ', error);
        this.error = 'Error updating season';
        this.loading = false;
      }
    },
    async deleteSeason(seasonId) {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();

      try {
        // Delete associated episodes
        const batch = writeBatch(firestore);
        const episodesSnapshot = await getDocs(query(collection(firestore, 'pooncasts'), where('saison', '==', seasonId)));
        episodesSnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();

        // Delete the season
        const seasonRef = doc(firestore, 'seasons', String(seasonId));
        await deleteDoc(seasonRef);

        this.seasons = this.seasons.filter(season => season.id !== seasonId);
        this.loading = false;
      } catch (error) {
        console.error('Error deleting season: ', error);
        this.error = 'Error deleting season';
        this.loading = false;
      }
    },

    async toggleParticipationFormVisible(seasonId) {
      const firestore = useFirestore();
      const season = this.seasons.find(p => p.id === seasonId);

      if (season) {
          // Toggle the  value locally
          season.participationFormVisible = !season.participationFormVisible;

          try {
              // Update the  field in Firestore
              const docRef = doc(firestore, 'seasons', String(season.id));
              await updateDoc(docRef, {
                participationFormVisible: season.participationFormVisible
              });
          } catch (error) {
              console.error('Error updating season:', error);
          }
      } else {
          console.warn(`Season with id ${seasonId} not found.`);
      }
    },
  },
});
