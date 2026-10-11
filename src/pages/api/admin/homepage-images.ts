import type { APIRoute } from 'astro';
import { checkAdminAuth, saveHomepageImages } from '../../../lib/db';
import type { HomepageImages } from '../../../lib/homepage';

export const prerender = false;

export const PUT: APIRoute = async ({ request, url }) => {
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
    const updates: Partial<HomepageImages> = {};
    if (typeof body.founder === 'string') updates.founder = body.founder;
    if (typeof body.story === 'string') updates.story = body.story;
    if (typeof body.philosophy === 'string') updates.philosophy = body.philosophy;

    const images = await saveHomepageImages(updates);
    return new Response(JSON.stringify(images), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error saving homepage images:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to save homepage images', details: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
