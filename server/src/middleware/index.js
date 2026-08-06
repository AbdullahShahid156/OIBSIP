import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

export { validate } from './validate.js';

const setupMiddleware = (app) => {
  app.use(helmet());

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later',
  });
  app.use('/api', limiter);

  app.use((req, res, next) => {
    req.requestTime = Date.now();
    next();
  });
};

export default setupMiddleware;
