import express from 'express';
import cors from 'cors';
import { CORS_ORIGINS, PORT } from './config.js';
import publicRouter from './routes/public.js';
import echobulleRouter from './routes/echobulle.js';
import adminRouter from './routes/admin.js';

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (CORS_ORIGINS.includes('*') || CORS_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'Reso•° API' }));
app.use('/public', publicRouter);
app.use('/', echobulleRouter);
app.use('/admin', adminRouter);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Reso•° API en écoute sur le port ${PORT}`);
  });
}

export default app;
export { app };
