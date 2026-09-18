export interface FragranceNote {
  id?: number;
  productId?: number;
  layer: 'top' | 'heart' | 'base';
  noteName: string;
  description?: string;
}

export interface ProductVariant {
  id?: number;
  productId?: number;
  size: string;
  price: number;
  inStock: boolean;
}

export interface Review {
  id?: number;
  productId?: number;
  authorName: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  badge?: string;
  featured: boolean;
  sortOrder: number;
  products?: Product[];
}

export interface Product {
  id: number;
  collectionId: number;
  collection?: Collection;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  concentration: string;
  scentFamily: string;
  gender: string;
  sillage: string;
  longevity: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  hoverImageUrl?: string;
  rating: number;
  reviewCount: number;
  isBestSeller: boolean;
  isNew: boolean;
  inStock: boolean;
  notes: FragranceNote[];
  variants: ProductVariant[];
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  readTime: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  published: boolean;
  createdAt: string;
}
