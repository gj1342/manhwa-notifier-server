import express from 'express';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import cors from 'cors';
import { CORS_ORIGIN } from './config/env.js';

const app = express();

app.set('trust proxy', 1);

app.use(express.json());

app.use(
  cors({
    origin: CORS_ORIGIN ? CORS_ORIGIN.split(',').map(o => o.trim()) : '*',
    credentials: true,
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

app.use(errorHandler);

export default app; 