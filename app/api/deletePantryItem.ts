import { NextApiRequest, NextApiResponse } from 'next';
import { deletePantryItem } from '../../services/firebasebackend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      await deletePantryItem(id);
      res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting document' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
