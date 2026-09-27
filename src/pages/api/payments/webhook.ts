import type { APIRoute } from 'astro';
import { updateOrderStatus } from '../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    const event = payload?.event;

    if (event === 'charge.success') {
      const data = payload?.data;
      const ref = data?.reference;
      if (ref) {
        await updateOrderStatus(ref, 'paid', String(data?.id || ''));
      }
    }

    return new Response(JSON.stringify({ status: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return new Response(JSON.stringify({ error: 'Webhook processing error' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
