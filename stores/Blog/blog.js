import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAuth } from 'firebase/auth';


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
            ...blog,
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
          this.error = 'Error adding blog';
          this.loading = false;
        }
    }
    }
});
