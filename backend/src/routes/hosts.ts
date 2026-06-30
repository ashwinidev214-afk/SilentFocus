import { Router, Request, Response } from 'express';
import { query, escape } from '../utils/db.js';

const router = Router();

// GET /api/hosts/:id/listings - Get all listings for a specific host
router.get('/:id/listings', async (req: Request, res: Response) => {
  const id = String(req.params.id);

  try {
    const listings = query(`
      SELECT l.*, c.name as category_name
      FROM listings l
      JOIN categories c ON l.category_id = c.id
      WHERE l.host_id = '${escape(id)}' AND l.status != 'archived'
    `);
    res.json(listings);
  } catch (error) {
    console.error('Error fetching host listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
