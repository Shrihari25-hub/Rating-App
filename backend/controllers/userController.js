const db = require('../config/database');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const { name, email, address, role, sortBy, sortOrder } = req.query;
      
      let query = `
        SELECT id, name, email, address, role, created_at, updated_at 
        FROM users 
        WHERE 1=1
      `;
      const values = [];
      let paramCount = 1;

      if (name) {
        query += ` AND name ILIKE $${paramCount}`;
        values.push(`%${name}%`);
        paramCount++;
      }

      if (email) {
        query += ` AND email ILIKE $${paramCount}`;
        values.push(`%${email}%`);
        paramCount++;
      }

      if (address) {
        query += ` AND address ILIKE $${paramCount}`;
        values.push(`%${address}%`);
        paramCount++;
      }

      if (role) {
        query += ` AND role = $${paramCount}`;
        values.push(role);
        paramCount++;
      }

      const validSortColumns = ['name', 'email', 'address', 'role', 'created_at'];
      if (sortBy && validSortColumns.includes(sortBy)) {
        const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
        query += ` ORDER BY ${sortBy} ${order}`;
      } else {
        query += ' ORDER BY created_at DESC';
      }

      const result = await db.query(query, values);
      
      res.json({ users: result.rows });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createUser: async (req, res) => {
    try {
      const { name, email, password, address, role } = req.body;

      if (!name || !email || !password || !address || !role) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (!['admin', 'user', 'store_owner'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const userCheck = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      const bcrypt = require('bcryptjs');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const result = await db.query(
        'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role, created_at',
        [name, email, hashedPassword, address, role]
      );

      const newUser = result.rows[0];

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          address: newUser.address,
          role: newUser.role,
          created_at: newUser.created_at
        }
      });

    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

updateUser: async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, address, role } = req.body;

    if (role && !['admin', 'user', 'store_owner'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const result = await db.query(
      'UPDATE users SET name = $1, email = $2, address = $3, role = $4, updated_at = NOW() WHERE id = $5 RETURNING id, name, email, address, role, created_at, updated_at',
      [name, email, address, role, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.code === '23505') {
      res.status(400).json({ error: 'User with this email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
},

deleteUser: async (req, res) => {
  try {
    const userId = req.params.id;

    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
},

  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const result = await db.query(
        'SELECT id, name, email, address, role, created_at, updated_at FROM users WHERE id = $1',
        [userId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: result.rows[0] });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

getDashboardStats: async (req, res) => {
  try {
    const usersStats = await db.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as normal_users,
        COUNT(CASE WHEN role = 'store_owner' THEN 1 END) as store_owners
      FROM users
    `);


    const storesStats = await db.query('SELECT COUNT(*) as total_stores FROM stores');
    
    const ratingsStats = await db.query('SELECT COUNT(*) as total_ratings FROM ratings');

    res.json({
      total_users: parseInt(usersStats.rows[0].total_users),
      admin_users: parseInt(usersStats.rows[0].admin_users),
      normal_users: parseInt(usersStats.rows[0].normal_users),
      store_owners: parseInt(usersStats.rows[0].store_owners),
      total_stores: parseInt(storesStats.rows[0].total_stores),
      total_ratings: parseInt(ratingsStats.rows[0].total_ratings)
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
};

module.exports = userController;