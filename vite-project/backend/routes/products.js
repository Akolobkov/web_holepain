// routes/products.js
const express = require('express');
const productsController = require('../controllers/productsController');

const router = express.Router();

// GET /api/products - все продукты
router.get('/', productsController.getAllProducts);

module.exports = router;