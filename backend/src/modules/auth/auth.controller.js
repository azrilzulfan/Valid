const { auth, db } = require('../../config/firebase');

// Register — dipanggil setelah Firebase Auth berhasil di frontend
const registerUser = async (req, res, next) => {
  try {
    const { uid, email, displayName, vocationField } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: 'uid dan email wajib diisi' });
    }

    // Cek apakah user sudah ada di Firestore
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      return res.status(409).json({ error: 'User sudah terdaftar' });
    }

    const userData = {
      uid,
      email,
      displayName:     displayName || '',
      vocationField:   vocationField || '',
      role:            'candidate', // candidate | verifier | admin
      verifierStatus:  null,        // null | pending | approved | rejected (hanya untuk verifier)
      reputationPoints: 0,
      badgeLevel:      null,
      isVerified:      false,
      createdAt:       new Date().toISOString(),
      updatedAt:       new Date().toISOString(),
    };

    await userRef.set(userData);

    res.status(201).json({
        message: 'Registrasi berhasil',
        user: userData
      });
    } catch (error) {
      next(error);
    }
};

// Login — verifikasi token Firebase dan kembalikan data user
const loginUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token tidak ditemukan' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    const userRef = db.collection('users').doc(decodedToken.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: 'User tidak ditemukan, silakan registrasi' });
    }

    res.json({
      message: 'Login berhasil',
      user: userSnap.data()
    });
  } catch (error) {
    next(error);
  }
};

// Get current user dari token
const getMe = async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json({ user: userSnap.data() });
  } catch (error) {
    next(error);
  }
};

// Logout — revoke refresh token Firebase
const logoutUser = async (req, res, next) => {
  try {
    await auth.revokeRefreshTokens(req.user.uid);
    res.json({ message: 'Logout berhasil' });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe, logoutUser };