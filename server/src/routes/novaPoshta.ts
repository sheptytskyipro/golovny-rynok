import { Router, Request, Response } from 'express';

const router = Router();

const NP_API_URL = 'https://api.novaposhta.ua/v2.0/json/';

async function npRequest(model: string, method: string, props: Record<string, unknown> = {}) {
  const apiKey = process.env.NOVA_POSHTA_API_KEY || '';
  const body = { apiKey, modelName: model, calledMethod: method, methodProperties: props };
  const response = await fetch(NP_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json() as { data: unknown[] };
  return data.data || [];
}

// GET /api/nova-poshta/cities?q=Київ
router.get('/cities', async (req: Request, res: Response) => {
  const q = req.query.q as string;
  if (!q || q.length < 2) { res.json({ cities: [] }); return; }

  try {
    const data = await npRequest('Address', 'searchSettlements', { CityName: q, Limit: 10 }) as Array<{ Addresses: Array<{ Ref: string; Present: string }> }>;
    const cities = data[0]?.Addresses?.map((a: { Ref: string; Present: string }) => ({
      ref: a.Ref, description: a.Present,
    })) || [];
    res.json({ cities });
  } catch {
    res.json({ cities: [] });
  }
});

// GET /api/nova-poshta/branches?cityRef=...
router.get('/branches', async (req: Request, res: Response) => {
  const cityRef = req.query.cityRef as string;
  if (!cityRef) { res.json({ branches: [] }); return; }

  try {
    const data = await npRequest('AddressGeneral', 'getWarehouses', { CityRef: cityRef, Limit: 50 }) as Array<{ Ref: string; Description: string; CityRef: string; Number: string }>;
    const branches = data.map((w: { Ref: string; Description: string; CityRef: string; Number: string }) => ({
      ref: w.Ref, description: w.Description, cityRef: w.CityRef, number: w.Number,
    }));
    res.json({ branches });
  } catch {
    res.json({ branches: [] });
  }
});

// POST /api/nova-poshta/track
router.post('/track', async (req: Request, res: Response) => {
  const { trackingNumber } = req.body;
  if (!trackingNumber) { res.status(400).json({ error: 'Missing tracking number' }); return; }

  try {
    const data = await npRequest('TrackingDocument', 'getStatusDocuments', {
      Documents: [{ DocumentNumber: trackingNumber }],
    }) as Array<{ Status: string; StatusCode: string }>;
    res.json({ tracking: data[0] || null });
  } catch {
    res.json({ tracking: null });
  }
});

export default router;
