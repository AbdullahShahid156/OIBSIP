import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

export { validate } from './validate.js';

const setupMiddleware = (app) => {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com", "https://sandbox.jazzcash.com.pk"],
        frameSrc: ["'self'", "https://checkout.razorpay.com", "https://sandbox.jazzcash.com.pk"],
        connectSrc: ["'self'", "https://api.razorpay.com"],
        formAction: ["'self'", "https://sandbox.jazzcash.com.pk"],
        imgSrc: ["'self'", "data:", "https:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }));

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
