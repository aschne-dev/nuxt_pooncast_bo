// stores/Pooncast.js
import { defineStore } from 'pinia';
import { useFirestore } from 'vuefire';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

export const usePooncastStore = defineStore('Pooncast', {
  state: () => ({
    pooncasts: [],
    loading: false,
    error: null,
  }),
  actions: {
    async addpooncast(pooncast, imageFile) {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();
      const storage = getStorage();
      const auth = getAuth();

      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User is not authenticated');
        }

        let imageUrl = '';
        if (imageFile) {
          const imageRef = storageRef(storage, `pooncast_images/${imageFile.name}`);
          const snapshot = await uploadBytes(imageRef, imageFile);
          imageUrl = await getDownloadURL(snapshot.ref);
        }

        // Calculate the next episode number for the given season
        const episodesInSeason = this.pooncasts.filter(p => p.saison === pooncast.saison);
        const nextEpisodeNumber = episodesInSeason.length > 0 ? Math.max(...episodesInSeason.map(e => e.episodeNumber)) + 1 : 1;

        const pooncastData = {
          ...pooncast,
          visuel: imageUrl,
          createdAt: new Date(),
          userId: user.uid,
          episodeNumber: nextEpisodeNumber,
        };

        const docRef = await addDoc(collection(firestore, 'pooncasts'), pooncastData);
        pooncastData.id = docRef.id;
        this.pooncasts.push(pooncastData);
        this.loading = false;
      } catch (error) {
        console.error('Error adding pooncast: ', error);
        this.error = 'Error adding pooncast';
        this.loading = false;
      }
    },
    async fetchpooncasts() {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();

      try {
        const snapshot = await getDocs(collection(firestore, 'pooncasts'));
        this.pooncasts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        this.loading = false;
      } catch (error) {
        console.error('Error fetching pooncasts: ', error);
        this.error = 'Error fetching pooncasts';
        this.loading = false;
      }
    }
  },
  getters: {
    episodesBySeason: (state) => {
      return (season) => state.pooncasts
        .filter(pooncast => pooncast.saison === season)
        .sort((a, b) => a.episodeNumber - b.episodeNumber);
    },
    pooncastById: (state) => {
      return (id) => state.pooncasts.find(pooncast => pooncast.id === id);
    },
    episodeCountBySeason: (state) => {
      return (season) => state.pooncasts.filter(pooncast => pooncast.saison === season).length;
    }
  },
});
