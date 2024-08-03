import { defineStore } from 'pinia';
import { useFirestore } from 'vuefire';
import { collection, getDocs, addDoc, updateDoc, getDoc, query, orderBy, runTransaction, where, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const useFaqStore = defineStore({
  id: 'FaqStore',
  state: () => ({ 
    faqs: [],
    loading: false,
    error: null
  }),
   
  getters: {
    totalCount: (state) => {
      return state.faqs.length;
    }
  },
   
  actions: {
    async fetchFaqs() {
      this.loading = true;

      const firestore = useFirestore();

      try {
        const faqQuery = query(collection(firestore, 'faq'), orderBy('order'));
        const snapshot = await getDocs(faqQuery);
        this.faqs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        this.loading = false;
      } catch (error) {
        console.error('Error fetching faq:', error);
        this.error = 'Error fetching faq';
        this.loading = false;
      }
    },

    async addFaq(faq) {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User is not authenticated');
      }

      const faqData = {
        ...faq,
        createdAt: new Date(),
        userId: user.uid,
        order: this.totalCount + 1
      };

      try {
        const docRef = await addDoc(collection(firestore, 'faq'), faqData);
        this.faqs.push({ ...faqData, id: docRef.id });
        this.loading = false;
      } catch (error) {
        console.error('Error adding faq:', error);
        this.error = 'Error adding faq';
        this.loading = false;
      }
    },

    async updateOrders(currentFaqId, newOrder, upOrDown) {
      this.loading = true;
      const firestore = useFirestore();

      try {
        await runTransaction(firestore, async (transaction) => {
          const currentFaqRef = doc(firestore, 'faq', currentFaqId);
          const currentFaqDoc = await transaction.get(currentFaqRef);
          if (!currentFaqDoc.exists()) {
            throw "Current FAQ does not exist!";
          }

          // Update the FAQ with the order - 1 or + 1 based on upOrDown
          if (upOrDown === 'up') {
            const prevFaqQuery = query(
              collection(firestore, 'faq'), 
              where('order', '==', newOrder)
            );
            const prevFaqSnapshot = await getDocs(prevFaqQuery);
            prevFaqSnapshot.forEach((faqDoc) => {
              transaction.update(faqDoc.ref, { order: newOrder + 1 });
            });
          }

          if (upOrDown === 'down') {
            const nextFaqQuery = query(
              collection(firestore, 'faq'), 
              where('order', '==', newOrder)
            );
            const nextFaqSnapshot = await getDocs(nextFaqQuery);
            nextFaqSnapshot.forEach((faqDoc) => {
              transaction.update(faqDoc.ref, { order: newOrder - 1 });
            });
          }

          // Update the current FAQ order
          transaction.update(currentFaqRef, { order: newOrder });
        });

        this.loading = false;
      } catch (error) {
        console.error('Error reordering faqs:', error);
        this.error = 'Error reordering faqs';
        this.loading = false;
      }
    },

    async updateFaq(id, faq) {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();

      try {
        const faqRef = doc(firestore, 'faq', id);
        await updateDoc(faqRef, faq);

        const updatedFaqDoc = await getDoc(faqRef);
        const updatedFaq = {
          ...updatedFaqDoc.data(),
          id: updatedFaqDoc.id
        }

        const index = this.faqs.findIndex(f => f.id === id);
        if (index !== -1) {
          this.faqs[index] = updatedFaq
        }
        this.loading = false;
      } catch (error) {
        console.error('Error updating faq:', error);
        this.error = 'Error updating faq';
        this.loading = false;
      }
    },

    async deleteFaq(id) {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();

      try {
        await runTransaction(firestore, async (transaction) => {
          const faqRef = doc(firestore, 'faq', id);
          const faqDoc = await transaction.get(faqRef);
          if (!faqDoc.exists()) {
            throw new Error("FAQ does not exist!");
          }

          const deletedOrder = faqDoc.data().order;

          // Delete the FAQ
          transaction.delete(faqRef);

          // Update the orders of the remaining FAQs
          const faqQuery = query(collection(firestore, 'faq'), where('order', '>', deletedOrder));
          const faqSnapshot = await getDocs(faqQuery);
          faqSnapshot.forEach((faqDoc) => {
            transaction.update(faqDoc.ref, { order: faqDoc.data().order - 1 });
          });

          // Mettre à jour l'état local en dehors de la transaction
          this.faqs = this.faqs.filter(f => f.id !== id);
          this.faqs.forEach((faq) => {
            if (faq.order > deletedOrder) {
              faq.order -= 1;
            }
          });
        });

        this.loading = false;
      } catch (error) {
        console.error('Error deleting faq:', error);
        this.error = 'Error deleting faq';
        this.loading = false;
      }
    },
  }
});
