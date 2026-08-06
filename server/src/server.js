import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import env from './config/env.js';
import connectDB from './config/database.js';
import setupMiddleware from './middleware/index.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupMiddleware(app);

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    message: 'PizzaCraft API',
    version: '1.0.0',
    docs: '/api/v1/health',
  });
});

app.use(errorHandler);

io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

app.set('io', io);

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  httpServer.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();

export { app, io };
