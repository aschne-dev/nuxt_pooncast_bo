import { collection, addDoc, getDocs, query, orderBy, doc, getDoc, updateDoc, deleteDoc, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { normalizeArticleEditorData } from '@/utils/seo-content';


export const useBlogStore = defineStore({
  id: 'Blog',
  state: () => ({ 
    blogs: [],
    loading: false,
    error: null
  }),
   
  getters: {
    totalCount: (state) => {
      return state.blogs.length;
    }
  },
   
  actions: {
    async fetchBlogs() {
        this.loading = true;
        this.error = null;
        const firestore = useFirestore();

        try {
            const blogsQuery = query(collection(firestore, 'blogs'), orderBy('order', 'desc'));
            const snapshot = await getDocs(blogsQuery);
            this.blogs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            this.loading = false;
          } catch (error) {
            console.error('Error fetching blogs: ', error);
            this.error = 'Error fetching blogs';
            this.loading = false;
          }
    },

    async addBlog(blog, imageFile) {
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
            const imageRef = storageRef(storage, `blog_visuels/${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
          }
  
          
          const blogData = {
            ...normalizeArticleEditorData(blog),
            visuel: imageUrl,
            createdAt: new Date(),
            userId: user.uid,
            order: this.totalCount + 1,
          };
  
          const docRef = await addDoc(collection(firestore, 'blogs'), blogData);
          blogData.id = docRef.id;
          this.blogs.push(blogData);
          this.loading = false;
        } catch (error) {
          console.error('Error adding blog: ', error);
          this.error = error.message || 'Error adding blog';
          this.loading = false;
        }
    },

    async editBlog(blogId, updatedBlog, imageFile) {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();
      const storage = getStorage();
    
      try {
        let imageUrl = updatedBlog.visuel;  // Conserver l'URL de l'image existante
        if (imageFile) {
          // Si un nouveau fichier est téléchargé, remplacez l'image existante
          const imageRef = storageRef(storage, `blog_visuels/${imageFile.name}`);
          const snapshot = await uploadBytes(imageRef, imageFile);
          imageUrl = await getDownloadURL(snapshot.ref);
        }
    
        // Construire l'objet de mise à jour
        const blogData = {
          ...normalizeArticleEditorData(updatedBlog),
          updatedAt: serverTimestamp(),
        };
        
        // Ajouter le champ `visuel` uniquement s'il est défini
        if (imageUrl !== undefined) {
          blogData.visuel = imageUrl;
        } else {
          delete blogData.visuel; // Assurez-vous que `visuel` n'est pas `undefined`
        }
  
        // Mettre à jour le document dans Firestore
        const docRef = doc(firestore, 'blogs', blogId);
        await updateDoc(docRef, blogData);
        
        // Récupérer le blog mis à jour depuis Firestore
        const updatedDoc = await getDoc(docRef);
  
        // Mettre à jour localement avec les données fraîches de Firestore
        const index = this.blogs.findIndex(b => b.id === blogId);
        if (index !== -1 && updatedDoc.exists()) {
          this.blogs[index] = { ...updatedDoc.data(), id: blogId };
        }
  
        this.loading = false;
      } catch (error) {
        console.error('Error editing blog: ', error);
        this.error = error.message || 'Error editing blog';
        this.loading = false;
      }
    },
  

    async deleteBlog(id) {
      this.loading = true;
      this.error = null;
      const firestore = useFirestore();
      const storage = getStorage();
    
      try {
        await runTransaction(firestore, async (transaction) => {
          const blogRef = doc(firestore, 'blogs', id);
          const blogDoc = await transaction.get(blogRef);
          if (!blogDoc.exists()) {
            throw new Error("Blog does not exist!");
          }
    
          const deletedOrder = blogDoc.data().order;
    
          // Delete the Blog document
          transaction.delete(blogRef);
    
          // Delete the image from Firebase Storage if it exists
          const blog = blogDoc.data();
          if (blog.visuel) {
            const imageRef = storageRef(storage, blog.visuel);
            await deleteObject(imageRef);
          }
    
          // Update the orders of the remaining Blogs
          const blogQuery = query(collection(firestore, 'blogs'), where('order', '>', deletedOrder));
          const blogSnapshot = await getDocs(blogQuery);
          blogSnapshot.forEach((docSnapshot) => {
            transaction.update(docSnapshot.ref, { order: docSnapshot.data().order - 1 });
          });
    
          // Update the local state
          this.blogs = this.blogs.filter(b => b.id !== id);
          this.blogs.forEach((blog) => {
            if (blog.order > deletedOrder) {
              blog.order -= 1;
            }
          });
        });
    
        this.loading = false;
      } catch (error) {
        console.error('Error deleting blog: ', error);
        this.error = 'Error deleting blog';
        this.loading = false;
      }
    },
    

    async updateOrders(currentBlogId, newOrder, upOrDown) {
      this.loading = true;
      const firestore = useFirestore();

      try {
        await runTransaction(firestore, async (transaction) => {
          const currentBlogRef = doc(firestore, 'blogs', currentBlogId);
          const currentBlogDoc = await transaction.get(currentBlogRef);
          if (!currentBlogDoc.exists()) {
            throw "Current Blog does not exist!";
          }

          // Update the FAQ with the order - 1 or + 1 based on upOrDown
          if (upOrDown === 'up') {
            const prevBlogQuery = query(
              collection(firestore, 'blogs'), 
              where('order', '==', newOrder)
            );
            const prevBlogSnapshot = await getDocs(prevBlogQuery);
            prevBlogSnapshot.forEach((blogDoc) => {
              transaction.update(blogDoc.ref, { order: newOrder + 1 });
            });
          }

          if (upOrDown === 'down') {
            const nextBlogQuery = query(
              collection(firestore, 'blogs'), 
              where('order', '==', newOrder)
            );
            const nextBlogSnapshot = await getDocs(nextBlogQuery);
            nextBlogSnapshot.forEach((blogDoc) => {
              transaction.update(blogDoc.ref, { order: newOrder - 1 });
            });
          }

          // Update the current FAQ order
          transaction.update(currentBlogRef, { order: newOrder });
        });

        this.loading = false;
      } catch (error) {
        console.error('Error reordering blogs:', error);
        this.error = 'Error reordering blogs';
        this.loading = false;
      }
    },
    }
});
