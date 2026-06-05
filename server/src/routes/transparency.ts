import { Router, Request, Response } from 'express';

const router = Router();

const mockTransparencyData = {
  totalCollected: 1247350,
  monthlyData: [
    { month: 'Вер 2023', amount: 145000, transactions: 42 },
    { month: 'Жов 2023', amount: 198000, transactions: 58 },
    { month: 'Лис 2023', amount: 212000, transactions: 63 },
    { month: 'Гру 2023', amount: 187500, transactions: 54 },
    { month: 'Січ 2024', amount: 256800, transactions: 72 },
    { month: 'Лют 2024', amount: 248050, transactions: 69 },
  ],
  directionData: [
    { name: 'Розробка дронів', value: 498940, color: '#7CB342' },
    { name: 'Гурток «Науковий»', value: 311838, color: '#F4801A' },
    { name: '3-тя штурмова', value: 249470, color: '#558B2F' },
    { name: '47-ма МАҐУРА', value: 187102, color: '#F5C518' },
  ],
  recentTransactions: [
    { id: 't1', date: '2024-02-15', amount: 18500, direction: 'Розробка дронів', type: 'item' },
    { id: 't2', date: '2024-02-15', amount: 2400, direction: 'Гурток «Науковий»', type: 'service' },
    { id: 't3', date: '2024-02-14', amount: 4200, direction: 'Розробка дронів', type: 'item' },
    { id: 't4', date: '2024-02-14', amount: 3500, direction: '47-ма МАҐУРА', type: 'service' },
    { id: 't5', date: '2024-02-13', amount: 7200, direction: '3-тя штурмова', type: 'item' },
  ],
};

// GET /api/transparency/stats
router.get('/stats', (_req: Request, res: Response) => {
  res.json(mockTransparencyData);
});

// GET /api/transparency/transactions
router.get('/transactions', (req: Request, res: Response) => {
  const { page = '1', limit = '20', direction } = req.query as Record<string, string>;
  let txs = [...mockTransparencyData.recentTransactions];
  if (direction) txs = txs.filter(t => t.direction === direction);

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const start = (pageNum - 1) * limitNum;

  res.json({
    transactions: txs.slice(start, start + limitNum),
    total: txs.length,
    page: pageNum,
  });
});

export default router;
