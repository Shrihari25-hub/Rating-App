const db = require('../config/database');

const User = {
  create: async (userData) => {
    const { name, email, password, address, role } = userData;
    const query = `
      INSERT INTO users (name, email, password, address, role) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, name, email, address, role, created_at, updated_at
    `;
    const values = [name, email, password, address, role || 'user'];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    
    try {
      const result = await db.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  findById: async (id) => {
    const query = 'SELECT id, name, email, address, role, created_at, updated_at FROM users WHERE id = $1';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  updatePassword: async (id, hashedPassword) => {
    const query = 'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING id';
    
    try {
      const result = await db.query(query, [hashedPassword, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = User;