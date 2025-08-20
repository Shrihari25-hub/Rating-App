const db = require('../config/database');

const storeOwnerController = {
  getDashboard: async (req, res) => {
    try {
      const ownerId = req.user.id;

      const storesResult = await db.query(
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

      let ratings = [];
      if (storesResult.rows.length > 0) {
        const ratingsResult = await db.query(
          `SELECT r.*, u.name as user_name, u.email as user_email
           FROM ratings r
           JOIN users u ON r.user_id = u.id
           WHERE r.store_id = $1
           ORDER BY r.created_at DESC
           LIMIT 10`,
          [storesResult.rows[0].id]
        );
        ratings = ratingsResult.rows;
      }

      res.json({
        stores: storesResult.rows,
        ratings: ratings
      });
    } catch (error) {
      console.error('Get store owner dashboard error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = storeOwnerController;