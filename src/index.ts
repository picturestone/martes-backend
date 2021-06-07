/**
 * Required External Modules
 */
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import http from 'http';

 /**
  * Import routes
  */
import indexRouter from './routes/index';
import testSuiteSchemesRouter from './routes/testSuiteSchemes';
import testSuitesRouter from './routes/testSuites';

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
app.use('/testsuiteschemes', testSuiteSchemesRouter);
app.use('/testsuites', testSuitesRouter);

/**
 * socket.io stuff
 */
const httpServer = http.createServer(app);
const socket = new Server(httpServer, {
   cors: {
      origin: '*'
   }
});

/**
 * Server Activation
 * 
 * Use httpServer.listen instead of app.listen so socketio can intercept requests
 */
httpServer.listen(PORT, () => {
   console.log(`Listening on port ${PORT}`);
});

/**
 * Export socket.io socket so it's reachable globally.
 */
export { socket };