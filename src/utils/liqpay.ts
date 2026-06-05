// LiqPay — demo mode only, no real API calls

export function generateOrderId(prefix: string = 'GM'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
