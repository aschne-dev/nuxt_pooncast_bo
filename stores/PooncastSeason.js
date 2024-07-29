import { defineStore } from 'pinia';
import { useFirestore } from 'vuefire';
import { collection, addDoc, getDocs, query, orderBy, limit, doc, setDoc, deleteDoc } from 'firebase/firestore';

export const usePodcastsSeasonStore = defineStore('podcastsSeason', {
  state: () => ({
    seasons: [],
    loading: false,
    error: null,
  }),
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
        // Get the last season ID and increment it
        const lastSeasonSnapshot = await getDocs(query(collection(firestore, 'seasons'), orderBy('id', 'desc'), limit(1)));
        let newId = 1;
        if (!lastSeasonSnapshot.empty) {
          newId = lastSeasonSnapshot.docs[0].data().id + 1;
        }

        const newSeason = {
          id: newId,
          title: title,
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
  },
});
