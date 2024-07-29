import { defineStore } from 'pinia';
import { useFirestore } from 'vuefire';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

export const usePooncastStore = defineStore('Pooncast', {
  state: () => ({
    podcasts: [],
    episodes: [],
    loading: false,
    error: null,
  }),
  actions: {
    async addPodcast(podcast, imageFile) {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();
      const storage = getStorage();
      const auth = getAuth();

      try {
        // Vérifier si l'utilisateur est authentifié
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User is not authenticated');
        }

        let imageUrl = '';
        if (imageFile) {
          const imageRef = storageRef(storage, `podcast_images/${imageFile.name}`);
          const snapshot = await uploadBytes(imageRef, imageFile);
          imageUrl = await getDownloadURL(snapshot.ref);
        }

        const podcastData = {
          ...podcast,
          visuel: imageUrl,
          createdAt: new Date(),
          userId: user.uid, // Ajouter l'UID de l'utilisateur pour référence
        };

        await addDoc(collection(firestore, 'podcasts'), podcastData);
        this.podcasts.push(podcastData);
        this.loading = false;
      } catch (error) {
        console.error('Error adding podcast: ', error);
        this.error = 'Error adding podcast';
        this.loading = false;
      }
    },
    async fetchPodcasts() {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();

      try {
        const snapshot = await getDocs(collection(firestore, 'podcasts'));
        this.podcasts = snapshot.docs.map(doc => doc.data());
        this.loading = false;
      } catch (error) {
        console.error('Error fetching podcasts: ', error);
        this.error = 'Error fetching podcasts';
        this.loading = false;
      }
    },
    async fetchEpisodesBySeason(seasonId) {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();

      try {
        const snapshot = await getDocs(query(collection(firestore, 'podcasts'), where('saison', '==', seasonId)));
        this.episodes = snapshot.docs.map(doc => doc.data());
        this.loading = false;
      } catch (error) {
        console.error('Error fetching episodes: ', error);
        this.error = 'Error fetching episodes';
        this.loading = false;
      }
    }
  },
  getters: {
    episodesBySeason: (state) => {
      return (season) => state.episodes.filter(podcast => podcast.saison === season);
    },
  },
});
