const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const demoRoutes = require('./routes/demo');
const { performanceMonitor, errorHandler } = require('./middleware/monitoring');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(performanceMonitor);
app.use(cors({
  origin: [
    'http://localhost:11100',
    'https://aqua-watch.krz-tech.net'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/demo', demoRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
