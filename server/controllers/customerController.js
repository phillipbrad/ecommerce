const pool = require('../config/database');
const bcrypt = require('bcrypt');

// Create customer controller
const createCustomer = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Validate input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if customer already exists
        const existingCustomerResult = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
        if (existingCustomerResult.rows.length > 0) {
            return res.status(409).json({ message: 'Customer already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new customer into database
        const newCustomerResult = await pool.query(
            'INSERT INTO customers (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [firstName, lastName, email, hashedPassword]
        );

        // Send success response
        res.status(201).json(newCustomerResult.rows[0]);

    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};

// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching customers', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
    const customerId = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM customers WHERE id = $1', [customerId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(`Error fetching customer with id ${customerId}`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update customer
const updateCustomer = async (req, res, next) => {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingCustomerResult = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);

        if (existingCustomerResult.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : existingCustomerResult.rows[0].password;

        const updatedCustomerResult = await pool.query(
            'UPDATE customers SET first_name = $1, last_name = $2, email = $3, password = $4 WHERE id = $5 RETURNING *',
            [firstName, lastName, email, hashedPassword, id]
        );

        res.status(200).json(updatedCustomerResult.rows[0]);
    } catch (err) {
        next(err);
    }
};

// Delete customer
const deleteCustomer = async (req, res, next) => {
    const { id } = req.params;

    try {
        const existingCustomerResult = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
        if (existingCustomerResult.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await pool.query('DELETE FROM customers WHERE id = $1', [id]);
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};
