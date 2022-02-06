import dotenv from 'dotenv';
const envPath = '.env';
dotenv.config({ path: envPath });
import express from 'express';
import path from 'path';
const __dirname = path.resolve();
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import sampleRouter from './routes/sampleRoutes.js';

const app = express();

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(cors());
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body-parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/hello', sampleRouter);
app.all('*', (req, res, next) => {
  const message = `Can't find the ${req.originalUrl} on this server`;
  const status = 404;
  next(new AppError(message, status));
});

app.use(globalErrorHandler);

export default app;
