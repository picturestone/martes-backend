/**
 * Required External Modules
 */
 import * as dotenv from 'dotenv';
 import express from 'express';
 import cors from 'cors';
 import helmet from 'helmet';

 /**
  * Import routes
  */
 import indexRouter from './routes/index';
 import testsuitesRouter from './routes/testsuites';
 
 dotenv.config();

/**
 * App Variables
 */
 if (!process.env.PORT) {
    process.exit(1);
 }
 
 const PORT: number = parseInt(process.env.PORT as string, 10);
 
 const app = express();

/**
 *  App Configuration
 */
 app.use(helmet());
 app.use(cors());
 app.use(express.json());

 /**
  * Routes
  */
 app.use('/', indexRouter);
 app.use('/testsuites', testsuitesRouter);

/**
 * Server Activation
 */
 app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });