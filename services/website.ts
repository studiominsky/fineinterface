import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
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
  categories: ('tech' | 'ai' | 'marketing')[];
  description: string;
  screenshotUrl?: string;
  createdBy: string;
  approved?: boolean;
  createdAt: number;
  ratings: { [userId: string]: number };
  averageRating: number;
};

const websitesRef = collection(db, 'websites');

export const addWebsite = async (
  data: Omit<
    WebsiteData,
    | 'id'
    | 'screenshotUrl'
    | 'ratings'
    | 'averageRating'
    | 'approved'
    | 'createdAt'
  >,
  file: File
) => {
  const storageRef = ref(
    storage,
    `websites/${data.createdBy}/${Date.now()}_${file.name}`
  );
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return await addDoc(websitesRef, {
    ...data,
    screenshotUrl: downloadURL,
    approved: false,
    ratings: {},
    averageRating: 0,
    createdAt: Date.now(),
  });
};

export const getApprovedWebsites = async (
  category?: string
): Promise<WebsiteData[]> => {
  const queryConstraints: QueryConstraint[] = [
    where('approved', '==', true),
  ];

  if (category && category !== 'all') {
    queryConstraints.push(
      where('categories', 'array-contains', category)
    );
  }

  const q = query(collection(db, 'websites'), ...queryConstraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as WebsiteData)
  );
};

export const getUnapprovedWebsites = async (): Promise<
  WebsiteData[]
> => {
  const q = query(websitesRef, where('approved', '==', false));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as WebsiteData)
  );
};

export const getWebsitesByUser = async (
  userId: string
): Promise<WebsiteData[]> => {
  const q = query(websitesRef, where('createdBy', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as WebsiteData)
  );
};

export const approveWebsite = async (id: string) => {
  await updateDoc(doc(db, 'websites', id), {
    approved: true,
  });
};

export const deleteWebsite = async (id: string) => {
  const websiteDoc = await getDoc(doc(db, 'websites', id));
  if (websiteDoc.exists()) {
    const websiteData = websiteDoc.data() as WebsiteData;
    if (websiteData.screenshotUrl) {
      const imageRef = ref(storage, websiteData.screenshotUrl);
      await deleteObject(imageRef);
    }
  }
  await deleteDoc(doc(db, 'websites', id));
};

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
