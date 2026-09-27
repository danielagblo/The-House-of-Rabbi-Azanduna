import type { APIRoute } from 'astro';
import { getProducts } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const filter = {
      collection: searchParams.get('collection') || undefined,
      collectionSlug: searchParams.get('collectionSlug') || undefined,
      scentFamily: searchParams.get('scentFamily') || undefined,
      gender: searchParams.get('gender') || undefined,
      concentration: searchParams.get('concentration') || undefined,
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sort: searchParams.get('sort') || undefined,
    };

    const products = await getProducts(filter);

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
      },
    });
  } catch (err: any) {
    console.error('Error fetching products:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch products', details: err?.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
