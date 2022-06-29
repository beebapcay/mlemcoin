// noinspection DuplicatedCode

import { CustomError } from '@shared/errors';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import StatusCodes from 'http-status-codes';
import logger from 'jet-logger';

import morgan from 'morgan';

import { apiRouter } from './routes/api';

const app = express();

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Log requests in dev mode
}

if (process.env.NODE_ENV === 'production') {
  app.use(helmet()); // Secure Express with Helmet
}

/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/

// Api routes
app.use('/api', apiRouter);

// Error handling
app.use((err: Error | CustomError, req: Request, res: Response, next: NextFunction) => {
  logger.err(err, true);
  const status = err instanceof CustomError ? err.HTTPS_STATUS : StatusCodes.BAD_REQUEST;
  res.status(status).json({
    error: err.message ?? 'Something went wrong'
  });
});

export const nodeProcessServer = app;
