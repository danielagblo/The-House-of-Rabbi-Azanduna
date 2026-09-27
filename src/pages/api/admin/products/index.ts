import type { APIRoute } from 'astro';
import { createProduct, checkAdminAuth } from '../../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  const authHeader = request.headers.get('Authorization');
  const token = url.searchParams.get('token');

  if (!checkAdminAuth(authHeader, token)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Admin authorization token required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const product = await createProduct(body);

    return new Response(JSON.stringify(product), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error creating product:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to create product', details: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
