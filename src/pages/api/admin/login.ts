import type { APIRoute } from 'astro';
import { verifyAdminPassword } from '../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return new Response(JSON.stringify({ error: 'Password is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!verifyAdminPassword(password)) {
      return new Response(
        JSON.stringify({ error: 'Invalid master password. Access denied.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = `azanduna_admin_token_${Math.floor(Date.now() / 1000)}`;

    return new Response(
      JSON.stringify({
        success: true,
        token,
        message: 'Authentication successful',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Admin login error:', err);
    return new Response(
      JSON.stringify({ error: 'Invalid login payload' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
