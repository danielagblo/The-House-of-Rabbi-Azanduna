import type { APIRoute } from 'astro';
import { updateProduct, deleteProduct, checkAdminAuth } from '../../../../lib/db';

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
    return new Response(JSON.stringify({ error: 'Invalid product ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const updates = await request.json();
    const updated = await updateProduct(id, updates);

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error updating product:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to update product', details: err?.message }),
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
    return new Response(JSON.stringify({ error: 'Invalid product ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await deleteProduct(id);
    return new Response(JSON.stringify({ success: true, deleted_id: id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error deleting product:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to delete product', details: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
