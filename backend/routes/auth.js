/* =====================================================
   🔐 RUTAS DE AUTENTICACIÓN - auth.js
   ===================================================== */

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  getUserStats,
  verifyEmail,
  deleteAccount,
  requestPasswordReset
} = require('../controllers/usersController');

const { authMiddleware } = require('../middlewares/authMiddleware'); // ✅ Import corregido

// Validación defensiva
const requiredControllers = [
  registerUser, loginUser, getUserProfile, updateUserProfile,
  changePassword, addAddress, updateAddress, deleteAddress, 
  getUserStats, verifyEmail, deleteAccount, requestPasswordReset
];

requiredControllers.forEach(fn => {
  if (typeof fn !== 'function') {
    throw new TypeError(`Controller must be a function: ${fn?.name || 'undefined'}`);
  }
});

/**
 * 🔓 RUTAS PÚBLICAS (sin autenticación)
 */
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', requestPasswordReset);

/**
 * 🔐 RUTAS PROTEGIDAS (requieren autenticación)
 */
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.post('/change-password', authMiddleware, changePassword);
router.post('/address', authMiddleware, addAddress);
router.put('/address/:addressId', authMiddleware, updateAddress);
router.delete('/address/:addressId', authMiddleware, deleteAddress);
router.get('/stats', authMiddleware, getUserStats);
router.post('/verify-email/:token', authMiddleware, verifyEmail);
router.delete('/account', authMiddleware, deleteAccount);

/**
 * 🔍 RUTA DE VERIFICACIÓN DE TOKEN
 */
router.get('/verify-token', authMiddleware, (req, res) => {
  res.json({
    success: true,
    mensaje: 'Token válido',
    usuario: {
      id: req.usuario._id,
      nombre: req.usuario.nombre,
      email: req.usuario.email
    }
  });
});

/**
 * 🚪 RUTA DE LOGOUT
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    mensaje: 'Logout exitoso'
  });
});

module.exports = router;
