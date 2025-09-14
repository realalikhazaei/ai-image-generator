import express from 'express';
import cors from 'cors';
import compression from 'compression';
import swaggerUI from 'swagger-ui-express';
import swaggerDoc from './docs/swagger.js';
import imageRoutes from './routes/imageRoutes.js';
import globalErrorHandler from './controllers/errorController.js';

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(cors());
app.use(compression());

app.use('/api', imageRoutes);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.options(/.*/, cors());

app.use(globalErrorHandler);

export default app;
