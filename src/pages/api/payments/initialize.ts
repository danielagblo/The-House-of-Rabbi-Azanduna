import type { APIRoute } from 'astro';
import { createOrder } from '../../../lib/db';
import { initializeTransaction } from '../../../lib/paystack';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingStreet,
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry,
      currency = 'GHS',
      callbackUrl,
      items,
    } = body;

    if (!customerEmail || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Customer email and at least one item are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let subtotal = 0;
    const orderItems = items.map((item: any) => {
      const lineTotal = Number(item.unitPrice || item.price || 0) * Number(item.quantity || 1);
      subtotal += lineTotal;
      return {
        productId: Number(item.productId || item.id || 0),
        productName: String(item.productName || item.name || 'Product'),
        variantSize: String(item.variantSize || item.size || 'Standard'),
        quantity: Number(item.quantity || 1),
        unitPrice: Number(item.unitPrice || item.price || 0),
        imageUrl: String(item.imageUrl || item.image || ''),
      };
    });

    let total = subtotal;
    if (total < 350.0) {
      total += 35.0; // Standard shipping
    }

    const reference = `OUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await createOrder(
      {
        reference,
        customerName: customerName || 'Valued Customer',
        customerEmail,
        customerPhone: customerPhone || '',
        shippingStreet: shippingStreet || '',
        shippingCity: shippingCity || '',
        shippingState: shippingState || '',
        shippingZip: shippingZip || '',
        shippingCountry: shippingCountry || 'Ghana',
        totalAmount: total,
        currency,
        status: 'pending',
      },
      orderItems
    );

    const amountMinor = Math.round(total * 100);
    const callback = callbackUrl || `/order/confirmation?reference=${reference}`;

    const paystackResp = await initializeTransaction({
      email: customerEmail,
      amount: amountMinor,
      reference,
      currency,
      callback_url: callback,
    });

    return new Response(
      JSON.stringify({
        status: 'success',
        reference,
        total,
        currency,
        paystack: paystackResp.data,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Payment initialization error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to initialize payment', details: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
