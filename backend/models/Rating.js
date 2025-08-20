const db = require('../config/database');

const Rating = {
  upsert: async (ratingData) => {
    const { user_id, store_id, rating } = ratingData;
    
    const checkQuery = 'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2';
    const checkResult = await db.query(checkQuery, [user_id, store_id]);
    
    if (checkResult.rows.length > 0) {
      // Update existing rating
      const updateQuery = `
        UPDATE ratings 
        SET rating = $1, updated_at = NOW() 
        WHERE user_id = $2 AND store_id = $3 
        RETURNING *
      `;
      const updateValues = [rating, user_id, store_id];
      
      try {
        const result = await db.query(updateQuery, updateValues);
        return result.rows[0];
      } catch (error) {
        throw error;
      }
    } else {
      // Insert new rating
      const insertQuery = `
        INSERT INTO ratings (user_id, store_id, rating) 
        VALUES ($1, $2, $3) 
        RETURNING *
      `;
      const insertValues = [user_id, store_id, rating];
      
      try {
        const result = await db.query(insertQuery, insertValues);
        return result.rows[0];
      } catch (error) {
        throw error;
      }
    }
  },

  findByUserAndStore: async (user_id, store_id) => {
    const query = 'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2';
    
    try {
      const result = await db.query(query, [user_id, store_id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  findByStoreId: async (store_id) => {
    const query = `
      SELECT r.*, u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
    `;
    
    try {
      const result = await db.query(query, [store_id]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  getStats: async () => {
    const query = 'SELECT COUNT(*) as total_ratings FROM ratings';
    
    try {
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Rating;