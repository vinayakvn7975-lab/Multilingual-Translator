const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const translationRoutes = require('./routes/translationRoutes');
const historyRoutes = require('./routes/historyRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '1mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Multilingual Translator backend is running smoothly.',
    timestamp: new Date(),
  });
});

// Mount Routes
app.use('/api/translate', translationRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/favorites', favoriteRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Express Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Multilingual Translator server running on port ${PORT}`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api/translate`);
  console.log(`=======================================================`);
});
