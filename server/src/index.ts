import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
import authRouter from './routes/auth.js';
import itemsRouter from './routes/items.js';
import servicesRouter from './routes/services.js';
import paymentsRouter from './routes/payments.js';
import novaPoshtaRouter from './routes/novaPoshta.js';
import transparencyRouter from './routes/transparency.js';

app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/nova-poshta', novaPoshtaRouter);
app.use('/api/transparency', transparencyRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Головний Ринок API' });
});

app.listen(PORT, () => {
  console.log(`🍎 Головний Ринок server running on port ${PORT}`);
});

export default app;
