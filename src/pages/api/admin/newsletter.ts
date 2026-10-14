import type { APIRoute } from 'astro';
import { checkAdminAuth, deleteNewsletterSubscriber, getNewsletterSubscribers } from '../../../lib/db';

export const prerender = false;

function unauthorized() {
  return new Response(
    JSON.stringify({ error: 'Unauthorized: Admin authorization token required' }),
    { status: 401, headers: { 'Content-Type': 'application/json' } }
  );
}

export const GET: APIRoute = async ({ request, url }) => {
  if (!checkAdminAuth(request.headers.get('Authorization'), url.searchParams.get('token'))) {
    return unauthorized();
  }

  try {
    const subscribers = await getNewsletterSubscribers();
    return new Response(JSON.stringify(subscribers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error listing newsletter subscribers:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to load newsletter emails', details: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  if (!checkAdminAuth(request.headers.get('Authorization'), url.searchParams.get('token'))) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const id = Number(body?.id);
    if (!id) {
      return new Response(JSON.stringify({ error: 'A subscriber id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await deleteNewsletterSubscriber(id);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error deleting newsletter subscriber:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to remove that email', details: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
