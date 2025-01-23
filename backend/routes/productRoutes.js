const express = require('express');
const { addProduct, getAllProducts } = require('../controllers/productController');

const router = express.Router();

// Route to add a new product
router.post('/add', addProduct);

// Route to fetch all products
router.get('/', getAllProducts);

module.exports = router;