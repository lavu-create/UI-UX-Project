const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const cors = require('cors'); // ✅ add this
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS setup
app.use(cors({
    origin: 'https://clario-1-4iuw.onrender.com',
    credentials: true
}));

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Clario Backend API' });
});

/** USER ROUTES */
app.use('/api/users', require('./routes/userRoutes'));

// Resource Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});