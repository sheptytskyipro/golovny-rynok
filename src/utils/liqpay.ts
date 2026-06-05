// LiqPay integration utilities
// Note: Private key operations must happen server-side only

export interface LiqPayParams {
  version: number;
  public_key: string;
  action: string;
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  result_url?: string;
  server_url?: string;
}

export interface LiqPayCheckoutResponse {
  data: string;
  signature: string;
  paymentUrl: string;
}

// Fetch checkout data from server (server handles signing)
export async function createLiqPayCheckout(params: {
  amount: number;
  description: string;
  orderId: string;
}): Promise<LiqPayCheckoutResponse> {
  const response = await fetch('/api/payments/liqpay-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!response.ok) throw new Error('Payment initialization failed');
  return response.json();
}

// Open LiqPay payment form
export function openLiqPayForm(data: string, signature: string) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://www.liqpay.ua/api/3/checkout';
  form.target = '_blank';

  const dataInput = document.createElement('input');
  dataInput.type = 'hidden';
  dataInput.name = 'data';
  dataInput.value = data;
  form.appendChild(dataInput);

  const signInput = document.createElement('input');
  signInput.type = 'hidden';
  signInput.name = 'signature';
  signInput.value = signature;
  form.appendChild(signInput);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

export function generateOrderId(prefix: string = 'GM'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
