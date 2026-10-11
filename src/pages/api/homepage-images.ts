import type { APIRoute } from 'astro';
import { getHomepageImages } from '../../lib/db';
import { HOMEPAGE_IMAGE_DEFAULTS } from '../../lib/homepage';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const images = await getHomepageImages();
    return new Response(JSON.stringify(images), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error fetching homepage images:', err);
    return new Response(JSON.stringify(HOMEPAGE_IMAGE_DEFAULTS), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
