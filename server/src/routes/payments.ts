import { Router, Request, Response } from 'express';
import crypto from 'crypto';

const router = Router();

function createLiqPaySignature(data: string, privateKey: string): string {
  return crypto.createHash('sha1').update(privateKey + data + privateKey).digest('base64');
}

function createLiqPayData(params: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(params)).toString('base64');
}

// POST /api/payments/liqpay-checkout
// Generate LiqPay data + signature server-side (private key never leaves server)
router.post('/liqpay-checkout', (req: Request, res: Response) => {
  const { amount, description, orderId } = req.body;

  if (!amount || !description || !orderId) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const publicKey = process.env.LIQPAY_PUBLIC_KEY;
  const privateKey = process.env.LIQPAY_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    // Return mock data for development
    const mockData = createLiqPayData({
      version: 3,
      public_key: 'sandbox_public_key',
      action: 'pay',
      amount,
      currency: 'UAH',
      description,
      order_id: orderId,
      sandbox: 1,
    });
    res.json({
      data: mockData,
      signature: 'mock_signature',
      paymentUrl: `https://www.liqpay.ua/api/3/checkout?data=${mockData}&signature=mock`,
    });
    return;
  }

  const params = {
    version: 3,
    public_key: publicKey,
    action: 'pay',
    amount: parseFloat(amount),
    currency: 'UAH',
    description,
    order_id: orderId,
    result_url: `${process.env.FRONTEND_URL}/payment-success`,
    server_url: `${process.env.FRONTEND_URL?.replace('https://', 'https://api.')}/api/payments/callback`,
  };

  const data = createLiqPayData(params);
  const signature = createLiqPaySignature(data, privateKey);

  res.json({
    data,
    signature,
    paymentUrl: `https://www.liqpay.ua/api/3/checkout`,
  });
});

// POST /api/payments/callback - LiqPay server-to-server callback
router.post('/callback', (req: Request, res: Response) => {
  const { data, signature } = req.body;
  const privateKey = process.env.LIQPAY_PRIVATE_KEY;

  if (!privateKey) {
    console.warn('LiqPay callback received but no private key configured');
    res.json({ ok: true });
    return;
  }

  // Validate callback signature
  const expectedSignature = createLiqPaySignature(data, privateKey);
  if (expectedSignature !== signature) {
    console.error('Invalid LiqPay callback signature');
    res.status(400).json({ error: 'Invalid signature' });
    return;
  }

  try {
    const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    console.log('LiqPay callback:', decoded.status, decoded.order_id, decoded.amount);

    if (decoded.status === 'success' || decoded.status === 'sandbox') {
      // In real app: update transaction status in DB, mark item/service as sold
      console.log(`Payment confirmed: order ${decoded.order_id}, amount ${decoded.amount} UAH`);
    }
  } catch (e) {
    console.error('Error processing LiqPay callback:', e);
  }

  res.json({ result: 'ok' });
});

// GET /api/payments/status/:orderId
router.get('/status/:orderId', (req: Request, res: Response) => {
  // Mock response
  res.json({
    orderId: req.params.orderId,
    status: 'success',
    amount: 0,
    direction: 'Розробка дронів',
  });
});

export default router;
