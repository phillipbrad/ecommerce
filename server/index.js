const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Mount all routes under the '/api' path
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/order-items', orderItemRoutes);

// Example endpoint
app.get('/', (req, res) => {
    res.send('Hello, Phil! Great job, you are now interacting with the server!');
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
