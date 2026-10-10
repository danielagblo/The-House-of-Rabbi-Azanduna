import type { Product } from '../types';

/** Attars are oud oils. Every other fragrance is a perfume. */
export function isAttar(product: Pick<Product, 'name' | 'subtitle' | 'concentration' | 'scentFamily' | 'collection'>): boolean {
  const text = [
    product.name,
    product.subtitle,
    product.concentration,
    product.scentFamily,
    product.collection?.name,
    product.collection?.slug,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return /\battars?\b|oud oils?|perfume oils?|bakhoor|mukhallat/.test(text);
}
