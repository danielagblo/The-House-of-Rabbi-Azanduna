import type { APIRoute } from 'astro';
import { createFaq, checkAdminAuth } from '../../../../lib/db';

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
    if (!body.question || !body.answer) {
      return new Response(
        JSON.stringify({ error: 'Question and Answer are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const faq = await createFaq(body);

    return new Response(JSON.stringify(faq), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error creating FAQ:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to create FAQ', details: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
