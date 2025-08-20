const jwt = require('jsonwebtoken');
const db = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const result = await db.query(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin required.' });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
};

const storeOwnerAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'store_owner' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Store owner or admin required.' });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { auth, adminAuth, storeOwnerAuth };