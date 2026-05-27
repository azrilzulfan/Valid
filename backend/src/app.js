require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const connectMongoDB = require('./config/mongodb');
const swaggerSpec = require('./config/swagger');
require('./config/firebase');

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const interviewRoutes = require('./modules/interview/interview.routes');
const portfolioRoutes = require('./modules/portfolio/portfolio.routes');
const badgeRoutes = require('./modules/badge/badge.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const notificationRoutes = require('./modules/notification/notification.routes');
const verifierRoutes = require('./modules/verifier/verifier.routes');
const paymentRoutes  = require('./modules/payment/payment.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security & Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Terlalu banyak request, coba lagi dalam 15 menit.' }
});
app.use('/api/', limiter);

// Swagger Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Valid API berjalan',
    timestamp: new Date(),
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/badge', badgeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/verifier', verifierRoutes);
app.use('/api/payment',  paymentRoutes);

// Error Handler — harus paling bawah
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectMongoDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
      console.log(`Dokumentasi API: http://localhost:${PORT}/api/docs`);
    });
  });
}

module.exports = app;