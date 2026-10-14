import type { APIRoute } from 'astro';
import { addNewsletterSubscriber } from '../../lib/db';

export const prerender = false;

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    if (!isEmail(email)) {
      return new Response(JSON.stringify({ error: 'Enter a valid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await addNewsletterSubscriber(email);
    return new Response(JSON.stringify({ ok: true, already: result.already }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error saving newsletter email:', err);
    return new Response(JSON.stringify({ error: 'Could not save your email. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
