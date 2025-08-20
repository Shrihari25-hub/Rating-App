const Rating = require('../models/Rating');

const ratingController = {
  submitRating: async (req, res) => {
    try {
      const { store_id, rating } = req.body;
      const user_id = req.user.id;

      // Submit rating
      const ratingData = {
        user_id,
        store_id,
        rating
      };

      const result = await Rating.upsert(ratingData);

      res.json({
        message: 'Rating submitted successfully',
        rating: result
      });
    } catch (error) {
      console.error('Submit rating error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getUserRating: async (req, res) => {
    try {
      const { storeId } = req.params;
      const user_id = req.user.id;

      const rating = await Rating.findByUserAndStore(user_id, storeId);

      res.json({ rating });
    } catch (error) {
      console.error('Get user rating error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getStoreRatings: async (req, res) => {
    try {
      const { storeId } = req.params;

      const ratings = await Rating.findByStoreId(storeId);

      res.json({ ratings });
    } catch (error) {
      console.error('Get store ratings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
getStats: async (req, res) => {
  try {
    const result = await db.query('SELECT COUNT(*) as total_ratings FROM ratings');
    
    res.json({
      total_ratings: parseInt(result.rows[0].total_ratings)
    });
  } catch (error) {
    console.error('Get rating stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
};

module.exports = ratingController;