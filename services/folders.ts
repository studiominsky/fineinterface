import { db } from '@/lib/firebase';
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from 'firebase/firestore';
import { WebsiteData } from './website';

export type Folder = {
  id: string;
  name: string;
  createdBy: string;
  websiteIds: string[];
};

const foldersRef = collection(db, 'folders');

export const createFolder = async (name: string, userId: string) => {
  return await addDoc(foldersRef, {
    name,
    createdBy: userId,
    websiteIds: [],
  });
};

export const getFoldersByUser = async (
  userId: string
): Promise<Folder[]> => {
  const q = query(foldersRef, where('createdBy', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Folder)
  );
};

export const addWebsiteToFolder = async (
  folderId: string,
  websiteId: string
) => {
  const folderRef = doc(db, 'folders', folderId);
  return await updateDoc(folderRef, {
    websiteIds: arrayUnion(websiteId),
  });
};

export const getWebsitesInFolder = async (
  folder: Folder
): Promise<WebsiteData[]> => {
  if (!folder.websiteIds || folder.websiteIds.length === 0) {
    return [];
  }

  const websitePromises = folder.websiteIds.map((id) =>
    getDoc(doc(db, 'websites', id))
  );
  const websiteDocs = await Promise.all(websitePromises);

  return websiteDocs
    .filter((doc) => doc.exists())
    .map((doc) => ({ id: doc.id, ...doc.data() } as WebsiteData));
};
