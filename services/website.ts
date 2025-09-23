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
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  getCountFromServer,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export const categorySlugs = [
  'portfolio',
  'assets',
  'software',
  'agency',
  'ai',
  'tech',
  'web3',
  'dev-tools',
  'design-tools',
  'marketing',
  'finance',
  'ecommerce',
  'web-apps',
  'desktop-apps',
  'productivity',
] as const;

type Category = (typeof categorySlugs)[number];

export type WebsiteData = {
  id: string;
  title: string;
  url: string;
  categories: Category[];
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
  category?: string,
  startAfterDoc?: DocumentSnapshot | null
): Promise<{ websites: WebsiteData[]; lastVisible: DocumentSnapshot | null; total: number }> => {
  const constraints: QueryConstraint[] = [
    where('approved', '==', true),
  ];

  if (category && category !== 'all') {
    constraints.push(where('categories', 'array-contains', category));
  }

  const q = query(collection(db, 'websites'), ...constraints);
  const totalSnapshot = await getCountFromServer(q);
  const total = totalSnapshot.data().count;

  const paginatedConstraints = [...constraints, orderBy('createdAt', 'desc'), limit(12)];

  if (startAfterDoc) {
    paginatedConstraints.push(startAfter(startAfterDoc));
  }

  const paginatedQuery = query(collection(db, 'websites'), ...paginatedConstraints);
  const snapshot = await getDocs(paginatedQuery);

  const websites = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as WebsiteData)
  );
  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

  return { websites, lastVisible, total };
};

export const getTotalApprovedWebsites = async (category?: string): Promise<number> => {
  const constraints: QueryConstraint[] = [where('approved', '==', true)];

  if (category && category !== 'all') {
    constraints.push(where('categories', 'array-contains', category));
  }

  const q = query(collection(db, 'websites'), ...constraints);
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
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

export const updateWebsite = async (
  id: string,
  data: Partial<Omit<WebsiteData, 'id' | 'createdBy'>>,
  newFile?: File | null
) => {
  const websiteRef = doc(db, 'websites', id);
  const updateData: Partial<Omit<WebsiteData, 'id'>> = { ...data };

  if (newFile) {
    const existingDoc = await getDoc(websiteRef);
    const existingData = existingDoc.data() as WebsiteData;

    if (existingData.screenshotUrl) {
      try {
        const oldImageRef = ref(storage, existingData.screenshotUrl);
        await deleteObject(oldImageRef);
      } catch (error) {
        console.warn(
          'Old screenshot not found or could not be deleted:',
          error
        );
      }
    }

    const storageRef = ref(
      storage,
      `websites/${existingData.createdBy}/${Date.now()}_${newFile.name
      }`
    );
    await uploadBytes(storageRef, newFile);
    updateData.screenshotUrl = await getDownloadURL(storageRef);
  }

  updateData.approved = false;

  await updateDoc(websiteRef, updateData);
};