const pool = require('../config/database');
const bcrypt = require('bcrypt');

//Create product

exports.createProduct = async (req, res, next) => {
    const { category_id, store_id, name, size, price, status } = req.body; // Extract product details from request body

    try {
        // Insert new product into the database
        const newProductResult = await pool.query(
            'INSERT INTO products (category_id, store_id, name, size, price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [category_id, store_id, name, size, price, status]
        );

        const newProduct = newProductResult.rows[0]; // Extract the newly inserted product from query result
        res.status(201).json(newProduct); // Send JSON response with newly created product and HTTP status 201 (Created)
    } catch (err) {
        next(err); // Pass any errors to the next error-handling middleware
    }
};

//Get all products.
exports.getAllProducts = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    }
};

//Get product by id.
exports.getProductById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

//Update product.
exports.updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { category_id, store_id, name, size, price, status } = req.body;

    try {
        const existingProductResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (existingProductResult.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProductResult = await pool.query(
            'UPDATE products SET category_id = $1, store_id = $2, name = $3, size = $4, price = $5, status = $6 WHERE id = $7 RETURNING *',
            [category_id, store_id, name, size, price, status, id]
        );

        const updatedProduct = updatedProductResult.rows[0];
        res.status(200).json(updatedProduct);
    } catch (err) {
        next(err);
    }
};

//Delete product.
exports.deleteProduct = async (req, res, next) => {
    const { id } = req.params;

    try {
        const existingProductResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (existingProductResult.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await pool.query('DELETE FROM products WHERE id = $1', [id]);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        next(err);
    }
};


