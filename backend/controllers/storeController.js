const Store = require('../models/Store');
const db = require('../config/database');
const User = require('../models/User');

const storeController = {

  getAllStores: async (req, res) => {
    try {
      const { name, email, address, sortBy, sortOrder } = req.query;
      const filters = { name, email, address, sortBy, sortOrder };
      
      const stores = await Store.findAll(filters);
      res.json({ stores });
    } catch (error) {
      console.error('Get stores error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  searchStores: async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const stores = await Store.search(q);
      res.json({ stores });
    } catch (error) {
      console.error('Search stores error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createStore: async (req, res) => {
    try {
      const { name, email, address, owner_email } = req.body;

      if (!name || !email || !address || !owner_email) {
        return res.status(400).json({ error: 'Name, email, address, and owner email are required' });
      }

      const user = await User.findByEmail(owner_email.trim());
      
      if (!user) {
        return res.status(400).json({ error: 'Store owner email not found' });
      }
      
      if (user.role !== 'store_owner') {
        return res.status(400).json({ error: 'User is not a store owner' });
      }
      
      const owner_id = user.id;

      const storeData = { name, email, address, owner_id };
      const newStore = await Store.create(storeData);

      res.status(201).json({
        message: 'Store created successfully',
        store: newStore
      });
    } catch (error) {
      console.error('Create store error:', error);
      
      if (error.code === '23505') { 
        res.status(400).json({ error: 'Store with this email already exists' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  getStore: async (req, res) => {
    try {
      const { id } = req.params;
      const store = await Store.findById(id);
      
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }

      res.json({ store });
    } catch (error) {
      console.error('Get store error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getStoreOwnerDashboard: async (req, res) => {
    try {
      const ownerId = req.user.id;

      // Verify user is a store owner
      if (req.user.role !== 'store_owner') {
        return res.status(403).json({ error: 'Access denied. Store owners only.' });
      }

      // Get stores owned by user with ratings
      const result = await db.query(
        `SELECT s.*, 
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.rating) as rating_count
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = $1
         GROUP BY s.id
         ORDER BY s.name`,
        [ownerId]
      );

      res.json({
        stores: result.rows
      });
    } catch (error) {
      console.error('Get store owner dashboard error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getStats: async (req, res) => {
    try {
      const [storesResult, ratingsResult] = await Promise.all([
        db.query('SELECT COUNT(*) as total_stores FROM stores'),
        db.query('SELECT COUNT(*) as total_ratings FROM ratings')
      ]);
      
      res.json({
        total_stores: parseInt(storesResult.rows[0].total_stores),
        total_ratings: parseInt(ratingsResult.rows[0].total_ratings)
      });
    } catch (error) {
      console.error('Get store stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = storeController;