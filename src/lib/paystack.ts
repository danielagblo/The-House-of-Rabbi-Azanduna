import 'dotenv/config';

export interface InitPaymentRequest {
  email: string;
  amount: number; // in minor units (e.g. 1000 pence/kobo/pesewas)
  reference: string;
  currency?: string;
  callback_url?: string;
  channels?: string[];
  metadata?: string;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    gateway_response?: string;
    paid_at?: string;
    created_at?: string;
    channel?: string;
    currency?: string;
    customer?: {
      email: string;
    };
  };
}

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export async function initializeTransaction(req: InitPaymentRequest): Promise<PaystackInitResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    console.log('[Paystack] No PAYSTACK_SECRET_KEY set. Returning simulated test payment authorization.');
    return {
      status: true,
      message: 'Simulated authorization generated (Local Dev)',
      data: {
        authorization_url: req.callback_url || `/order/confirmation?reference=${req.reference}&simulated=true`,
        access_code: `test_code_${req.reference}`,
        reference: req.reference,
      },
    };
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Paystack initialize failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as PaystackInitResponse;
}

export async function verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    console.log(`[Paystack] Simulating transaction verification for ref: ${reference}`);
    return {
      status: true,
      message: 'Simulated verification successful (Local Dev)',
      data: {
        id: Date.now(),
        status: 'success',
        reference,
        amount: 1000,
        currency: 'GHS',
        channel: 'card',
      },
    };
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Paystack verify failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as PaystackVerifyResponse;
}
