import { API_BASE_URL } from '../lib/apiConfig';

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export interface PaymentOrder {
  mode: 'demo' | 'razorpay';
  orderId: string;
  amount: number;
  currency: string;
  keyId?: string | null;
  message?: string;
}

export const getPaymentMode = async () => {
  const res = await fetch(`${API_BASE_URL}/payments/mode`);
  if (!res.ok) throw new Error('Failed to load payment mode');
  return res.json();
};

export const createCheckoutOrder = async (
  token: string,
  body: {
    amount?: number;
    currency?: string;
    purpose?: string;
    referenceId?: string;
    programId?: string;
    workshopId?: string;
    planName?: string;
  },
): Promise<{ success: boolean; order: PaymentOrder }> => {
  const res = await fetch(`${API_BASE_URL}/payments/checkout/create-order`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Could not create payment order');
  }
  return res.json();
};

export const verifyCheckout = async (
  token: string,
  body: { orderId: string; paymentId?: string; signature?: string; mode: string },
) => {
  const res = await fetch(`${API_BASE_URL}/payments/checkout/verify`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Payment verification failed');
  }
  return res.json();
};

/** Demo flow: create + auto-verify in one step (no gateway keys needed). */
export const runDemoCheckout = async (
  token: string,
  body: Parameters<typeof createCheckoutOrder>[1],
) => {
  const { order } = await createCheckoutOrder(token, body);
  return verifyCheckout(token, {
    orderId: order.orderId,
    paymentId: `demo_${Date.now()}`,
    mode: order.mode,
  });
};
