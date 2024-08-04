import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc, DocumentData } from 'firebase/firestore';
import { PantryItem } from '../models/pantryItem';

const pantryCollection = collection(db, 'pantryItems');

export const addPantryItem = async (item: Omit<PantryItem, 'id'>) => {
  const docRef = await addDoc(pantryCollection, item);
  const newItem = { id: parseInt(docRef.id), ...item };  // Convert string ID to number
  await updateDoc(docRef, newItem);  // Update the document to include the numeric ID
  return newItem.id;
};

export const updatePantryItem = async (id: number, updates: Partial<PantryItem>) => {
  const docRef = doc(db, 'pantryItems', id.toString());  // Convert number ID to string
  await updateDoc(docRef, updates);
};

export const deletePantryItem = async (id: number) => {
  const docRef = doc(db, 'pantryItems', id.toString());  // Convert number ID to string
  await deleteDoc(docRef);
};

export const getPantryItems = async () => {
  const querySnapshot = await getDocs(pantryCollection);
  const items: PantryItem[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data() as DocumentData;
    items.push({ id: parseInt(doc.id), ...data } as PantryItem);  // Convert string ID to number
  });
  return items;
};
