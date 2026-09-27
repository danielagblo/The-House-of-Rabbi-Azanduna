import type { APIRoute } from 'astro';
import { getBlogPosts } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const posts = await getBlogPosts();
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
      },
    });
  } catch (err: any) {
    console.error('Error fetching blogs:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch blogs', details: err?.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
