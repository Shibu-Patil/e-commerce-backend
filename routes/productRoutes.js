const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');

// GET all products
router.get('/all', productController.getAllProducts);

// POST add product with image
router.post('/add', upload.single('image'), productController.addProduct);

module.exports = router;
