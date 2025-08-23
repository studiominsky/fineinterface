import { db } from '@/lib/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';

export type WebsiteData = {
  title: string;
  url: string;
  category: 'tech' | 'ai' | 'marketing';
  description: string;
  screenshotUrl?: string;
  createdBy: string;
  approved?: boolean;
  createdAt: number;
};

const websitesRef = collection(db, 'websites');

export const addWebsite = async (data: WebsiteData) => {
  return await addDoc(websitesRef, {
    ...data,
    approved: false,
  });
};

export const getApprovedWebsites = async () => {
  const q = query(websitesRef, where('approved', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteWebsite = async (id: string) => {
  await deleteDoc(doc(db, 'websites', id));
};

export const approveWebsite = async (id: string) => {
  await updateDoc(doc(db, 'websites', id), {
    approved: true,
  });
};
