const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');


router.post('/', customerController.createCustomer);//create new customer
router.get('/customers', customerController.getAllCustomers);//get all customer
router.get('user/:id', customerController.getCustomerById);//Get user by id
router.put('/:id', customerController.updateCustomer);//Update customer
router.delete('/:id', customerController.deleteCustomer);//Delete customer

module.exports = router;