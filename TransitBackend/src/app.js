const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const { createGoogleAuthenticator } = require('./auth');
const { createApiRouter } = require('./routes');
const { HttpError } = require('./errors');

function createApp({ pool, config, mailer, authenticate = createGoogleAuthenticator(config) }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || config.frontendOrigins.includes(origin)) return callback(null, true);
      return callback(new HttpError(403, 'This website origin is not allowed.'));
    },
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use((req, res, next) => {
    const started = Date.now();
    res.on('finish', () => {
      console.info(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - started}ms`);
    });
    next();
  });

  app.get('/health', async (req, res, next) => {
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
      next(error);
    }
  });

  app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
  }));
  app.use('/api', authenticate);
  app.use('/api', createApiRouter({ pool, config, mailer }));

  app.use((req, res, next) => next(new HttpError(404, 'Route not found.')));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = error.status || (error.type === 'entity.too.large' ? 413 : 500);
    if (status >= 500) {
      console.error('Request failed', {
        method: req.method,
        path: req.path,
        error: error.message,
      });
    }
    const message = status >= 500 ? 'An internal server error occurred.' : error.message;
    return res.status(status).json({ error: message });
  });
  return app;
}

module.exports = { createApp };
