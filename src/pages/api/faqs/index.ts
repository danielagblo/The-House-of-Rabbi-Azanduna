import type { APIRoute } from 'astro';
import { getFaqs } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const faqs = await getFaqs(false);
    return new Response(JSON.stringify(faqs), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
      },
    });
  } catch (err: any) {
    console.error('Error fetching FAQs:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch FAQs', details: err?.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
