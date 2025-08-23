import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export type WebsiteData = {
  id: string;
  title: string;
  url: string;
  category: 'tech' | 'ai' | 'marketing';
  description: string;
  screenshotUrls?: string[];
  createdBy: string;
  approved?: boolean;
  createdAt: number;
  ratings: { [userId: string]: number };
  averageRating: number;
};

const websitesRef = collection(db, 'websites');

// Add a new website with images and an initial rating
export const addWebsite = async (
  data: Omit<
    WebsiteData,
    | 'id'
    | 'screenshotUrls'
    | 'ratings'
    | 'averageRating'
    | 'approved'
    | 'createdAt'
  >,
  files: FileList,
  initialRating: number
) => {
  const screenshotUrls: string[] = [];
  await Promise.all(
    Array.from(files).map(async (file) => {
      const storageRef = ref(
        storage,
        `websites/${data.createdBy}/${Date.now()}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      screenshotUrls.push(downloadURL);
    })
  );

  return await addDoc(websitesRef, {
    ...data,
    screenshotUrls,
    approved: false,
    ratings: { [data.createdBy]: initialRating },
    averageRating: initialRating,
    createdAt: Date.now(),
  });
};

// Get all approved websites
export const getApprovedWebsites = async (): Promise<
  WebsiteData[]
> => {
  const q = query(websitesRef, where('approved', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as WebsiteData)
  );
};

// Get all unapproved websites for admin review
export const getUnapprovedWebsites = async (): Promise<
  WebsiteData[]
> => {
  const q = query(websitesRef, where('approved', '==', false));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as WebsiteData)
  );
};

// Get all websites submitted by a specific user
export const getWebsitesByUser = async (
  userId: string
): Promise<WebsiteData[]> => {
  const q = query(websitesRef, where('createdBy', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as WebsiteData)
  );
};

// Approve a website
export const approveWebsite = async (id: string) => {
  await updateDoc(doc(db, 'websites', id), {
    approved: true,
  });
};

// Delete a website and its associated images
export const deleteWebsite = async (id: string) => {
  const websiteDoc = await getDoc(doc(db, 'websites', id));
  if (websiteDoc.exists()) {
    const websiteData = websiteDoc.data() as WebsiteData;
    if (websiteData.screenshotUrls) {
      for (const url of websiteData.screenshotUrls) {
        const imageRef = ref(storage, url);
        await deleteObject(imageRef);
      }
    }
  }
  await deleteDoc(doc(db, 'websites', id));
};

// Rate a website
export const rateWebsite = async (
  websiteId: string,
  userId: string,
  rating: number
) => {
  const websiteRef = doc(db, 'websites', websiteId);
  const websiteDoc = await getDoc(websiteRef);

  if (websiteDoc.exists()) {
    const websiteData = websiteDoc.data() as WebsiteData;
    const newRatings = { ...websiteData.ratings, [userId]: rating };
    const ratingsArray = Object.values(newRatings);
    const averageRating =
      ratingsArray.reduce((acc, curr) => acc + curr, 0) /
      ratingsArray.length;

    await updateDoc(websiteRef, {
      ratings: newRatings,
      averageRating: averageRating,
    });
  }
};
