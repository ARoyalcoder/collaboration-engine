import express from 'express';
import apiRouter from './routes/index.js';
import { notFoundHandler } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js'; 

import cors from 'cors';


const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api/v1', apiRouter);
  
app.use(notFoundHandler);
app.use(errorHandler);
export default app;