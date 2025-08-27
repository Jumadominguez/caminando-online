const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productsController');
const { validateProduct } = require('../validators/productValidator');
const { validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', validateProduct, handleValidation, createProduct);
router.put('/:id', validateProduct, handleValidation, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;