import { NextApiRequest, NextApiResponse } from 'next';
import { updatePantryItem } from '../../services/firebasebackend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const { id, updates } = req.body;
      await updatePantryItem(id, updates);
      res.status(200).json({ message: 'Item updated' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating document' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
