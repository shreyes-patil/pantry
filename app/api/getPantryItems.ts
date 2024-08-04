// pages/api/getPantryItems.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getPantryItems } from '../../services/firebasebackend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const items = await getPantryItems();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching documents' });
    }
  } else {
    res.status(405).end(); 
  }
}
