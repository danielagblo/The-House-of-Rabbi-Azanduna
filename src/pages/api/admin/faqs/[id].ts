import type { APIRoute } from 'astro';
import { updateFaq, deleteFaq, checkAdminAuth } from '../../../../lib/db';

export const prerender = false;

export const PUT: APIRoute = async ({ params, request, url }) => {
  const authHeader = request.headers.get('Authorization');
  const token = url.searchParams.get('token');

  if (!checkAdminAuth(authHeader, token)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Admin authorization token required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const id = Number(params.id);
  if (!id) {
    return new Response(JSON.stringify({ error: 'Invalid FAQ ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const updates = await request.json();
    await updateFaq(id, updates);

    return new Response(JSON.stringify({ message: 'FAQ updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error updating FAQ:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to update FAQ', details: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ params, request, url }) => {
  const authHeader = request.headers.get('Authorization');
  const token = url.searchParams.get('token');

  if (!checkAdminAuth(authHeader, token)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Admin authorization token required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const id = Number(params.id);
  if (!id) {
    return new Response(JSON.stringify({ error: 'Invalid FAQ ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await deleteFaq(id);
    return new Response(JSON.stringify({ message: 'FAQ deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error deleting FAQ:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to delete FAQ', details: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
