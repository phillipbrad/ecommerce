const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createProduct); // POST create a new product
router.get('/', productController.getAllProducts); // GET all products
router.get('/:id', productController.getProductById); // GET product by ID
router.put('/:id', productController.updateProduct); // PUT update product
router.delete('/:id', productController.deleteProduct); // DELETE product

module.exports = router;
