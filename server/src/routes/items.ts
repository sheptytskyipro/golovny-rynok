import { Router, Request, Response } from 'express';

const router = Router();

// Mock data
const mockItems = [
  { id: '1', sellerId: 1, sellerName: 'Олена К.', title: 'Ноутбук Dell Latitude 5520', price: 18500, category: 'техніка', city: 'Київ', status: 'active', createdAt: '2024-02-15' },
  { id: '2', sellerId: 2, sellerName: 'Микола Д.', title: 'Туристичне спорядження', price: 4200, category: 'туризм', city: 'Львів', status: 'active', createdAt: '2024-02-10' },
];

// GET /api/items
router.get('/', (_req: Request, res: Response) => {
  const { category, city, search, page = '1', limit = '20' } = _req.query as Record<string, string>;

  let items = [...mockItems];
  if (category && category !== 'all') items = items.filter(i => i.category === category);
  if (city) items = items.filter(i => i.city.toLowerCase().includes(city.toLowerCase()));
  if (search) items = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const start = (pageNum - 1) * limitNum;
  const paginated = items.slice(start, start + limitNum);

  res.json({ items: paginated, total: items.length, page: pageNum, limit: limitNum });
});

// GET /api/items/:id
router.get('/:id', (req: Request, res: Response) => {
  const item = mockItems.find(i => i.id === req.params.id);
  if (!item) { res.status(404).json({ error: 'Item not found' }); return; }
  res.json({ item });
});

// POST /api/items - create item
router.post('/', (req: Request, res: Response) => {
  const { title, description, price, category, city, legend } = req.body;
  if (!title || !description || !price || !category || !city) {
    res.status(400).json({ error: 'Missing required fields' }); return;
  }
  const newItem = {
    id: Date.now().toString(),
    sellerId: 1, // would come from auth
    sellerName: 'User',
    title, description, price: parseFloat(price), category, city,
    legend: legend || null,
    status: 'pending_moderation',
    createdAt: new Date().toISOString(),
  };
  res.status(201).json({ item: newItem, message: 'Item submitted for moderation' });
});

// PATCH /api/items/:id/status
router.patch('/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!['active', 'sold', 'reserved'].includes(status)) {
    res.status(400).json({ error: 'Invalid status' }); return;
  }
  res.json({ success: true, id: req.params.id, status });
});

export default router;
