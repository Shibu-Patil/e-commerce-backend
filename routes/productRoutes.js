const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');


router.get('/all', productController.getAllProducts);


router.post('/add', upload.single('image'), productController.addProduct);

module.exports = router;
