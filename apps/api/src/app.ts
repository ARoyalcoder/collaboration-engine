import express from 'express';
import apiRouter from './routes/index.js';
import { notFoundHandler } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js'; 



const app = express();

app.use(express.json());

app.use('/api/v1', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
export default app;