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
const authMiddleware = require('../middlewares/authMiddleware');

// Validación defensiva
const requiredControllers = [
  'registerUser', 'loginUser', 'getUserProfile', 'updateUserProfile',
  'changePassword', 'addAddress', 'updateAddress', 'deleteAddress', 
  'getUserStats', 'verifyEmail', 'deleteAccount', 'requestPasswordReset'
];

requiredControllers.forEach(controller => {
  if (typeof eval(controller) !== 'function') {
    throw new TypeError(`${controller} must be a function`);
  }
});

/**
 * 🔓 RUTAS PÚBLICAS (sin autenticación)
 */

// POST /api/auth/register - Registro de usuario
router.post('/register', registerUser);

// POST /api/auth/login - Login de usuario
router.post('/login', loginUser);

// POST /api/auth/forgot-password - Solicitar recuperación de contraseña
router.post('/forgot-password', requestPasswordReset);

/**
 * 🔐 RUTAS PROTEGIDAS (requieren autenticación)
 */

// GET /api/auth/profile - Obtener perfil del usuario
router.get('/profile', authMiddleware, getUserProfile);

// PUT /api/auth/profile - Actualizar perfil del usuario
router.put('/profile', authMiddleware, updateUserProfile);

// POST /api/auth/change-password - Cambiar contraseña
router.post('/change-password', authMiddleware, changePassword);

// POST /api/auth/address - Agregar dirección
router.post('/address', authMiddleware, addAddress);

// PUT /api/auth/address/:addressId - Actualizar dirección específica
router.put('/address/:addressId', authMiddleware, updateAddress);

// DELETE /api/auth/address/:addressId - Eliminar dirección específica
router.delete('/address/:addressId', authMiddleware, deleteAddress);

// GET /api/auth/stats - Obtener estadísticas del usuario
router.get('/stats', authMiddleware, getUserStats);

// POST /api/auth/verify-email/:token - Verificar email
router.post('/verify-email/:token', authMiddleware, verifyEmail);

// DELETE /api/auth/account - Eliminar/desactivar cuenta
router.delete('/account', authMiddleware, deleteAccount);

/**
 * 🔍 RUTA DE VERIFICACIÓN DE TOKEN
 */
router.get('/verify-token', authMiddleware, (req, res) => {
  // Si llegamos aquí, el token es válido (gracias al middleware)
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
  // En un sistema basado en JWT, el logout se maneja en el frontend
  // eliminando el token. Aquí solo confirmamos la acción.
  res.json({
    success: true,
    mensaje: 'Logout exitoso'
  });
});

module.exports = router;