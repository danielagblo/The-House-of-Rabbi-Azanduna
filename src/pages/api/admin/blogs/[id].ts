import type { APIRoute } from 'astro';
import { updateBlogPost, deleteBlogPost, checkAdminAuth } from '../../../../lib/db';

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
    return new Response(JSON.stringify({ error: 'Invalid blog ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const updates = await request.json();
    await updateBlogPost(id, updates);

    return new Response(JSON.stringify({ message: 'Blog post updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error updating blog post:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to update blog post', details: err?.message }),
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
    return new Response(JSON.stringify({ error: 'Invalid blog ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await deleteBlogPost(id);
    return new Response(JSON.stringify({ message: 'Blog post deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error deleting blog post:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to delete blog post', details: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
