import type { Product } from '../types';

/** Attars are the oud-oil line. Every other fragrance is a perfume. */
export function isAttar(product: Pick<Product, 'name' | 'subtitle' | 'concentration' | 'scentFamily' | 'collection'>): boolean {
  const group = [product.collection?.name, product.collection?.slug, product.name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return /\battars?\b|oud perfume oils?|oud-perfume-oils?|oud oils?/.test(group);
}
