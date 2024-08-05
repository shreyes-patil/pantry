import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc, DocumentData } from 'firebase/firestore';
import { PantryItem } from '../models/pantryItem';

const pantryCollection = collection(db, 'pantryItems');

export const addPantryItem = async (item: Omit<PantryItem, 'id'>): Promise<PantryItem> => {
  const docRef = await addDoc(pantryCollection, item);
  return { id: docRef.id, ...item }; // Ensure id is a string
};

export const updatePantryItem = async (id: string, updates: Partial<PantryItem>): Promise<void> => {
  const docRef = doc(db, 'pantryItems', id);
  await updateDoc(docRef, updates);
};

export const deletePantryItem = async (id: string): Promise<void> => {
  const docRef = doc(db, 'pantryItems', id);
  await deleteDoc(docRef);
};

export const getPantryItems = async (): Promise<PantryItem[]> => {
  const querySnapshot = await getDocs(pantryCollection);
  const items: PantryItem[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data() as DocumentData;
    items.push({ id: doc.id, ...data } as PantryItem); // Ensure id is a string
  });
  return items;
};
