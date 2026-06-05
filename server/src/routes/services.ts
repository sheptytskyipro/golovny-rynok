import { Router, Request, Response } from 'express';

const router = Router();

const mockServices = [
  { id: 's1', providerId: 1, providerName: 'Олена Коваль', title: 'Курс англійської (8 занять)', price: 2400, category: 'освіта', format: 'онлайн', duration: '8 год', status: 'active' },
  { id: 's2', providerId: 2, providerName: 'Артем Дизайн', title: 'Дизайн логотипу', price: 3500, category: 'дизайн', format: 'онлайн', duration: '5-7 днів', status: 'active' },
];

// GET /api/services
router.get('/', (_req: Request, res: Response) => {
  const { category } = _req.query as Record<string, string>;
  let services = [...mockServices];
  if (category && category !== 'all') services = services.filter(s => s.category === category);
  res.json({ services, total: services.length });
});

// GET /api/services/:id
router.get('/:id', (req: Request, res: Response) => {
  const service = mockServices.find(s => s.id === req.params.id);
  if (!service) { res.status(404).json({ error: 'Service not found' }); return; }
  res.json({ service });
});

// POST /api/services
router.post('/', (req: Request, res: Response) => {
  const { title, description, price, category, format, duration } = req.body;
  if (!title || !description || !price || !category) {
    res.status(400).json({ error: 'Missing required fields' }); return;
  }
  const newService = {
    id: `s${Date.now()}`,
    providerId: 1,
    providerName: 'User',
    title, description, price: parseFloat(price), category,
    format: format || 'онлайн',
    duration: duration || '',
    status: 'pending_moderation',
    createdAt: new Date().toISOString(),
  };
  res.status(201).json({ service: newService, message: 'Service submitted for moderation' });
});

export default router;
