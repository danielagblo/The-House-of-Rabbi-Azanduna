import type { APIRoute } from 'astro';
import { createBlogPost, checkAdminAuth } from '../../../../lib/db';

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
    if (!body.title || !body.slug) {
      return new Response(
        JSON.stringify({ error: 'Title and Slug are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const post = await createBlogPost(body);

    return new Response(JSON.stringify(post), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error creating blog post:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to create blog post', details: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
