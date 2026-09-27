import type { APIRoute } from 'astro';
import { getCollections } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const collections = await getCollections();
    return new Response(JSON.stringify(collections), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
      },
    });
  } catch (err: any) {
    console.error('Error fetching collections:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch collections', details: err?.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
