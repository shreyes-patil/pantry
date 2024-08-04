// pages/api/addPantryItem.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { addPantryItem } from '../../services/firebasebackend';
import { PantryItem } from '../../models/pantryItem';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const pantryItem: PantryItem = req.body;
      const id = await addPantryItem(pantryItem);
      res.status(200).json({ id });
    } catch (error) {
      res.status(500).json({ error: 'Error adding document' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
