const db = require('../config/database');

const Store = {
  findAll: async (filters = {}) => {
    let query = `
      SELECT s.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.rating) as rating_count
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.name) {
      query += ` AND s.name ILIKE $${paramCount}`;
      values.push(`%${filters.name}%`);
      paramCount++;
    }

    if (filters.email) {
      query += ` AND s.email ILIKE $${paramCount}`;
      values.push(`%${filters.email}%`);
      paramCount++;
    }

    if (filters.address) {
      query += ` AND s.address ILIKE $${paramCount}`;
      values.push(`%${filters.address}%`);
      paramCount++;
    }

    query += ' GROUP BY s.id';

    const validSortColumns = ['name', 'email', 'address', 'average_rating', 'rating_count'];
    if (filters.sortBy && validSortColumns.includes(filters.sortBy)) {
      const order = filters.sortOrder === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY ${filters.sortBy} ${order}`;
    } else {
      query += ' ORDER BY s.name ASC';
    }

    const result = await db.query(query, values);
    return result.rows;
  },

  // Search stores by name 
  search: async (searchTerm) => {
    const query = `
      SELECT s.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.rating) as rating_count
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.name ILIKE $1 OR s.address ILIKE $1
      GROUP BY s.id
      ORDER BY average_rating DESC
    `;
    
    const result = await db.query(query, [`%${searchTerm}%`]);
    return result.rows;
  },

  // Create new store
  create: async (storeData) => {
    const { name, email, address, owner_id } = storeData;
    const query = `
      INSERT INTO stores (name, email, address, owner_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const values = [name, email, address, owner_id || null];
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  findById: async (id) => {
    const query = `
      SELECT s.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.rating) as rating_count
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1
      GROUP BY s.id
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = Store;