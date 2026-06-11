// src/middleware/auth.js

const { auth } = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak: Token tidak disediakan' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; 
    next();
  } catch (error) {
    console.error('Error memverifikasi token Firebase:', error);
    return res.status(403).json({ message: 'Akses ditolak: Token tidak valid atau kedaluwarsa' });
  }
};

module.exports = { verifyToken };