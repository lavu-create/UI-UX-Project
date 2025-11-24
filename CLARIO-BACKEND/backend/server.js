const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config({ path: '../.env' });
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---------------- CORS -------------------
const corsOptions = {
  origin: 'https://ubiquitous-adventure-69pwvwqg7j96c5pwr-5501.app.github.dev', // your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
// Handle preflight requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', corsOptions.origin);
    res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
    res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});


// Routes
app.use('/api/users', require('./routes/userRoutes'));

// Error middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.green.bold)
);