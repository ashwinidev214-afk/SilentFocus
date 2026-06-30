import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { query, escape } from '../utils/db.js';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/listings - Get all listings with filters
router.get('/', async (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const minPrice = req.query.minPrice as string | undefined;
  const maxPrice = req.query.maxPrice as string | undefined;
  const startDate = req.query.startDate as string | undefined;
  const endDate = req.query.endDate as string | undefined;
  const location = req.query.location as string | undefined;
  const search = req.query.search as string | undefined;
  const minRating = req.query.minRating as string | undefined;

  let sql = `
    SELECT l.*, c.name as category_name, h.bio as host_bio, u.first_name as host_first_name, u.last_name as host_last_name,
    (SELECT AVG(rating) FROM reviews WHERE listing_id = l.id) as average_rating
    FROM listings l
    JOIN categories c ON l.category_id = c.id
    JOIN host_profiles h ON l.host_id = h.id
    JOIN users u ON h.user_id = u.id
    WHERE l.status = 'published'
  `;

  if (category) {
    sql += ` AND c.name = '${escape(category)}'`;
  }

  if (minPrice) {
    sql += ` AND l.price >= ${Number(minPrice)}`;
  }

  if (maxPrice) {
    sql += ` AND l.price <= ${Number(maxPrice)}`;
  }

  if (startDate) {
    sql += ` AND l.start_date >= '${escape(startDate)}'`;
  }

  if (endDate) {
    sql += ` AND l.end_date <= '${escape(endDate)}'`;
  }

  if (location) {
    sql += ` AND l.location_address LIKE '%${escape(location)}%'`;
  }

  if (search) {
    sql += ` AND (l.title LIKE '%${escape(search)}%' OR l.description LIKE '%${escape(search)}%')`;
  }

  try {
    let listings = query(sql);

    if (minRating) {
      listings = listings.filter(l => (l.average_rating || 0) >= Number(minRating));
    }

    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/listings/:id - Get listing details
router.get('/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);

  try {
    const listings = query(`
      SELECT l.*, c.name as category_name, h.bio as host_bio, u.first_name as host_first_name, u.last_name as host_last_name, u.profile_picture as host_profile_picture
      FROM listings l
      JOIN categories c ON l.category_id = c.id
      JOIN host_profiles h ON l.host_id = h.id
      JOIN users u ON h.user_id = u.id
      WHERE l.id = '${escape(id)}'
    `);

    if (listings.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const listing = listings[0];

    // Fetch reviews
    const reviews = query(`
      SELECT r.*, u.first_name, u.last_name, u.profile_picture
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.listing_id = '${escape(id)}'
      ORDER BY r.created_at DESC
    `);

    // Calculate availability
    const confirmedBookings = query(`
      SELECT COUNT(*) as count FROM bookings 
      WHERE listing_id = '${escape(id)}' AND status IN ('confirmed', 'completed')
    `);
    const bookedCount = confirmedBookings[0]?.count || 0;
    const availability = {
      capacity: listing.capacity,
      booked: bookedCount,
      remaining: Math.max(0, listing.capacity - bookedCount)
    };

    res.json({ ...listing, reviews, availability });
  } catch (error) {
    console.error('Error fetching listing details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/listings - Create listing (Host only)
router.post('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  if (!req.user || (req.user.role !== 'host' && req.user.role !== 'admin')) {
    return res.status(403).json({ error: 'Only hosts can create listings' });
  }

  const { category_id, title, description, location_address, location_latitude, location_longitude, price, currency, duration_minutes, start_date, end_date, capacity } = req.body;

  if (!category_id || !title || !description || !location_address || !price || !capacity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get host_id for the user
    const hosts = query(`SELECT id FROM host_profiles WHERE user_id = '${req.user.id}'`);
    if (hosts.length === 0) {
      return res.status(403).json({ error: 'User is not registered as a host' });
    }
    const host_id = hosts[0].id;

    const id = crypto.randomUUID();
    const sql = `
      INSERT INTO listings (
        id, host_id, category_id, title, description, location_address, location_latitude, location_longitude,
        price, currency, duration_minutes, start_date, end_date, capacity, status
      ) VALUES (
        '${id}', '${host_id}', '${escape(category_id)}', '${escape(title)}', '${escape(description)}', '${escape(location_address)}',
        ${location_latitude || 'NULL'}, ${location_longitude || 'NULL'}, ${Number(price)}, '${escape(currency || 'USD')}',
        ${duration_minutes || 'NULL'}, ${start_date ? `'${escape(start_date)}'` : 'NULL'}, ${end_date ? `'${escape(end_date)}'` : 'NULL'},
        ${Number(capacity)}, 'published'
      )
    `;

    query(sql);
    res.status(201).json({ id, message: 'Listing created successfully' });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/listings/:id - Update listing
router.put('/:id', authenticateJWT, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  const { category_id, title, description, location_address, location_latitude, location_longitude, price, currency, duration_minutes, start_date, end_date, capacity, status } = req.body;

  try {
    const listings = query(`SELECT host_id FROM listings WHERE id = '${escape(id)}'`);
    if (listings.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const hostProfile = query(`SELECT id FROM host_profiles WHERE user_id = '${req.user?.id}'`);
    if (hostProfile.length === 0 || (listings[0].host_id !== hostProfile[0].id && req.user?.role !== 'admin')) {
      return res.status(403).json({ error: 'You can only edit your own listings' });
    }

    let sql = `UPDATE listings SET updated_at = CURRENT_TIMESTAMP`;
    if (category_id) sql += `, category_id = '${escape(category_id)}'`;
    if (title) sql += `, title = '${escape(title)}'`;
    if (description) sql += `, description = '${escape(description)}'`;
    if (location_address) sql += `, location_address = '${escape(location_address)}'`;
    if (location_latitude) sql += `, location_latitude = ${Number(location_latitude)}`;
    if (location_longitude) sql += `, location_longitude = ${Number(location_longitude)}`;
    if (price) sql += `, price = ${Number(price)}`;
    if (currency) sql += `, currency = '${escape(currency)}'`;
    if (duration_minutes) sql += `, duration_minutes = ${Number(duration_minutes)}`;
    if (start_date) sql += `, start_date = '${escape(start_date)}'`;
    if (end_date) sql += `, end_date = '${escape(end_date)}'`;
    if (capacity) sql += `, capacity = ${Number(capacity)}`;
    if (status) sql += `, status = '${escape(status)}'`;

    sql += ` WHERE id = '${escape(id)}'`;

    query(sql);
    res.json({ message: 'Listing updated successfully' });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/listings/:id - Soft delete listing
router.delete('/:id', authenticateJWT, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);

  try {
    const listings = query(`SELECT host_id FROM listings WHERE id = '${escape(id)}'`);
    if (listings.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const hostProfile = query(`SELECT id FROM host_profiles WHERE user_id = '${req.user?.id}'`);
    if (hostProfile.length === 0 || (listings[0].host_id !== hostProfile[0].id && req.user?.role !== 'admin')) {
      return res.status(403).json({ error: 'You can only delete your own listings' });
    }

    query(`UPDATE listings SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id = '${escape(id)}'`);
    res.json({ message: 'Listing archived successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
