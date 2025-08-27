const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/usersController');
const authMiddleware = require('../middlewares/authMiddleware');

// Validación defensiva
if (typeof registerUser !== 'function') {
  throw new TypeError('registerUser must be a function');
}
if (typeof loginUser !== 'function') {
  throw new TypeError('loginUser must be a function');
}

router.post('/register', registerUser);
router.post('/login', loginUser);

// Ruta protegida
router.get('/perfil', authMiddleware, (req, res) => {
  res.json({
    usuario: {
      id: req.usuario._id,
      nombre: req.usuario.nombre,
      email: req.usuario.email
    }
  });
});

module.exports = router;