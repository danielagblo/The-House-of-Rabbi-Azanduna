import type { APIRoute } from 'astro';
import { getOrderByReference, updateOrderStatus } from '../../../../lib/db';
import { verifyTransaction } from '../../../../lib/paystack';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { reference } = params;
  if (!reference) {
    return new Response(JSON.stringify({ error: 'Order reference is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const order = await getOrderByReference(reference);
    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const verifyResp = await verifyTransaction(reference);

    if (verifyResp?.data?.status === 'success') {
      await updateOrderStatus(reference, 'paid', String(verifyResp.data.id || ''));
      order.status = 'paid';
    }

    return new Response(
      JSON.stringify({
        order,
        paystack: verifyResp.data,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to verify transaction', details: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
