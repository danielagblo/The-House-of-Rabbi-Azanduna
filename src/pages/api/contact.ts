import type { APIRoute } from 'astro';
import { getPool } from '../../lib/db';
import { CONTACT_TO_EMAIL } from '../../config/contact';

export const prerender = false;

function clean(value: unknown, max: number): string {
  return String(value || '').trim().slice(0, max);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const name = clean(body.name, 120);
    const email = clean(body.email, 200);
    const message = clean(body.message, 4000);

    if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Please enter your name, a valid email, and a message.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const db = getPool();
      await db.query(
        `CREATE TABLE IF NOT EXISTS contact_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          email VARCHAR(200) NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      );
      await db.query('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
    } catch (err) {
      console.error('Contact message was not stored:', err);
    }

    const mailed = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_TO_EMAIL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `Website message from ${name}`,
        _replyto: email,
        _template: 'table',
      }),
    });

    if (!mailed.ok) {
      const detail = await mailed.text();
      console.error('Contact email failed:', mailed.status, detail);
      return new Response(JSON.stringify({ error: 'Message could not be delivered.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(JSON.stringify({ error: 'Message could not be delivered.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
