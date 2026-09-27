import 'dotenv/config';
import mysql from 'mysql2/promise';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import type { Collection, Product, FragranceNote, ProductVariant, Review, Order, OrderItem, BlogPost, FAQ } from '../types';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    const host = process.env.DB_HOST || '127.0.0.1';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASS || '';
    const database = process.env.DB_NAME || 'rabbi';
    const port = Number(process.env.DB_PORT) || 3306;

    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return pool;
}

// ----------------- Data Mappers (snake_case DB -> camelCase Types) -----------------

function mapCollection(row: any): Collection {
  return {
    id: Number(row.id),
    name: row.name || '',
    slug: row.slug || '',
    subtitle: row.subtitle || '',
    description: row.description || '',
    imageUrl: row.image_url || '',
    badge: row.badge || undefined,
    featured: Boolean(row.featured),
    sortOrder: Number(row.sort_order) || 0,
    products: [],
  };
}

function mapProduct(row: any): Product {
  return {
    id: Number(row.id),
    collectionId: Number(row.collection_id) || 0,
    name: row.name || '',
    slug: row.slug || '',
    subtitle: row.subtitle || '',
    description: row.description || '',
    concentration: row.concentration || '',
    scentFamily: row.scent_family || '',
    gender: row.gender || 'Unisex',
    sillage: row.sillage || 'Strong',
    longevity: row.longevity || '12+ Hours',
    price: Number(row.price) || 0,
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    imageUrl: row.image_url || '',
    hoverImageUrl: row.hover_image_url || undefined,
    rating: Number(row.rating) || 5.0,
    reviewCount: Number(row.review_count) || 0,
    isBestSeller: Boolean(row.is_best_seller),
    isNew: Boolean(row.is_new),
    inStock: Boolean(row.in_stock),
    notes: [],
    variants: [],
    reviews: [],
  };
}

function mapFragranceNote(row: any): FragranceNote {
  return {
    id: Number(row.id),
    productId: Number(row.product_id),
    layer: row.layer as 'top' | 'heart' | 'base',
    noteName: row.note_name || '',
    description: row.description || '',
  };
}

function mapVariant(row: any): ProductVariant {
  return {
    id: Number(row.id),
    productId: Number(row.product_id),
    size: row.size || '',
    price: Number(row.price) || 0,
    inStock: Boolean(row.in_stock),
  };
}

function mapReview(row: any): Review {
  return {
    id: Number(row.id),
    productId: Number(row.product_id),
    authorName: row.author_name || '',
    rating: Number(row.rating) || 5,
    title: row.title || '',
    comment: row.comment || '',
    verifiedPurchase: Boolean(row.verified_purchase),
    createdAt: String(row.created_at || ''),
  };
}

function mapOrder(row: any): Order {
  return {
    id: Number(row.id),
    reference: row.reference || '',
    paystackRef: row.paystack_ref || '',
    customerName: row.customer_name || '',
    customerEmail: row.customer_email || '',
    customerPhone: row.customer_phone || '',
    shippingStreet: row.shipping_street || '',
    shippingCity: row.shipping_city || '',
    shippingState: row.shipping_state || '',
    shippingZip: row.shipping_zip || '',
    shippingCountry: row.shipping_country || 'Ghana',
    totalAmount: Number(row.total_amount) || 0,
    currency: row.currency || 'GHS',
    status: row.status || 'pending',
    items: [],
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || ''),
  };
}

function mapOrderItem(row: any): OrderItem {
  return {
    id: Number(row.id),
    orderId: Number(row.order_id),
    productId: Number(row.product_id),
    productName: row.product_name || '',
    variantSize: row.variant_size || '',
    quantity: Number(row.quantity) || 1,
    unitPrice: Number(row.unit_price) || 0,
    imageUrl: row.image_url || '',
  };
}

function mapBlogPost(row: any): BlogPost {
  return {
    id: Number(row.id),
    title: row.title || '',
    slug: row.slug || '',
    excerpt: row.excerpt || '',
    content: row.content || '',
    imageUrl: row.image_url || '',
    category: row.category || '',
    readTime: row.read_time || '',
    published: Boolean(row.published),
    sortOrder: Number(row.sort_order) || 0,
    createdAt: String(row.created_at || ''),
  };
}

function mapFAQ(row: any): FAQ {
  return {
    id: Number(row.id),
    category: row.category || '',
    question: row.question || '',
    answer: row.answer || '',
    sortOrder: Number(row.sort_order) || 0,
    published: Boolean(row.published),
    createdAt: String(row.created_at || ''),
  };
}

// ----------------- Collections Operations -----------------

export async function getCollections(): Promise<Collection[]> {
  const db = getPool();
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM collections ORDER BY sort_order ASC, id ASC');
  const collections = rows.map(mapCollection);

  const [prods] = await db.query<RowDataPacket[]>('SELECT * FROM products');
  const [variants] = await db.query<RowDataPacket[]>('SELECT * FROM product_variants');

  const variantsByProdId = new Map<number, ProductVariant[]>();
  for (const v of variants) {
    const list = variantsByProdId.get(v.product_id) || [];
    list.push(mapVariant(v));
    variantsByProdId.set(v.product_id, list);
  }

  const prodsByColId = new Map<number, Product[]>();
  for (const p of prods) {
    const prod = mapProduct(p);
    prod.variants = variantsByProdId.get(prod.id) || [];
    const list = prodsByColId.get(prod.collectionId) || [];
    list.push(prod);
    prodsByColId.set(prod.collectionId, list);
  }

  for (const col of collections) {
    col.products = prodsByColId.get(col.id) || [];
  }

  return collections;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const db = getPool();
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM collections WHERE slug = ? LIMIT 1', [slug]);
  if (!rows || rows.length === 0) return null;

  const collection = mapCollection(rows[0]);
  const [prods] = await db.query<RowDataPacket[]>('SELECT * FROM products WHERE collection_id = ?', [collection.id]);
  const [notes] = await db.query<RowDataPacket[]>('SELECT * FROM fragrance_notes');
  const [variants] = await db.query<RowDataPacket[]>('SELECT * FROM product_variants');

  const notesByProdId = new Map<number, FragranceNote[]>();
  for (const n of notes) {
    const list = notesByProdId.get(n.product_id) || [];
    list.push(mapFragranceNote(n));
    notesByProdId.set(n.product_id, list);
  }

  const variantsByProdId = new Map<number, ProductVariant[]>();
  for (const v of variants) {
    const list = variantsByProdId.get(v.product_id) || [];
    list.push(mapVariant(v));
    variantsByProdId.set(v.product_id, list);
  }

  collection.products = prods.map((p) => {
    const prod = mapProduct(p);
    prod.notes = notesByProdId.get(prod.id) || [];
    prod.variants = variantsByProdId.get(prod.id) || [];
    return prod;
  });

  return collection;
}

export async function getCollectionById(id: number): Promise<Collection | null> {
  const db = getPool();
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM collections WHERE id = ? LIMIT 1', [id]);
  if (!rows || rows.length === 0) return null;
  return mapCollection(rows[0]);
}

export async function createCollection(col: Partial<Collection>): Promise<Collection> {
  const db = getPool();
  const now = new Date();
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO collections (name, slug, subtitle, description, image_url, badge, featured, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      col.name,
      col.slug,
      col.subtitle || '',
      col.description || '',
      col.imageUrl || '',
      col.badge || '',
      col.featured ? 1 : 0,
      col.sortOrder || 0,
      now,
      now,
    ]
  );
  return (await getCollectionById(result.insertId))!;
}

export async function updateCollection(id: number, updates: Partial<Collection>): Promise<Collection | null> {
  const db = getPool();
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.slug !== undefined) { fields.push('slug = ?'); values.push(updates.slug); }
  if (updates.subtitle !== undefined) { fields.push('subtitle = ?'); values.push(updates.subtitle); }
  if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
  if (updates.imageUrl !== undefined) { fields.push('image_url = ?'); values.push(updates.imageUrl); }
  if (updates.badge !== undefined) { fields.push('badge = ?'); values.push(updates.badge); }
  if (updates.featured !== undefined) { fields.push('featured = ?'); values.push(updates.featured ? 1 : 0); }
  if (updates.sortOrder !== undefined) { fields.push('sort_order = ?'); values.push(updates.sortOrder); }

  if (fields.length > 0) {
    fields.push('updated_at = ?');
    values.push(new Date());
    values.push(id);
    await db.query(`UPDATE collections SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  return getCollectionById(id);
}

export async function deleteCollection(id: number): Promise<void> {
  const db = getPool();
  const [otherCols] = await db.query<RowDataPacket[]>('SELECT id FROM collections WHERE id != ? ORDER BY id ASC LIMIT 1', [id]);
  if (otherCols && otherCols.length > 0) {
    const fallbackId = otherCols[0].id;
    await db.query('UPDATE products SET collection_id = ? WHERE collection_id = ?', [fallbackId, id]);
  } else {
    const [pRows] = await db.query<RowDataPacket[]>('SELECT id FROM products WHERE collection_id = ?', [id]);
    for (const p of pRows) {
      await deleteProduct(p.id);
    }
  }
  await db.query('DELETE FROM collections WHERE id = ?', [id]);
}

// ----------------- Products Operations -----------------

export interface ProductFilter {
  collection?: string;
  collectionSlug?: string;
  scentFamily?: string;
  gender?: string;
  concentration?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export async function getProducts(filter: ProductFilter = {}): Promise<Product[]> {
  const db = getPool();
  let sql = 'SELECT p.*, c.name as collection_name, c.slug as collection_slug FROM products p LEFT JOIN collections c ON p.collection_id = c.id WHERE 1=1';
  const params: any[] = [];

  const colSlug = filter.collectionSlug || filter.collection;
  if (colSlug && colSlug !== 'all') {
    sql += ' AND c.slug = ?';
    params.push(colSlug);
  }

  if (filter.scentFamily && filter.scentFamily !== 'all') {
    sql += ' AND LOWER(p.scent_family) = ?';
    params.push(filter.scentFamily.toLowerCase());
  }

  if (filter.gender && filter.gender !== 'all') {
    sql += ' AND LOWER(p.gender) = ?';
    params.push(filter.gender.toLowerCase());
  }

  if (filter.concentration && filter.concentration !== 'all') {
    sql += ' AND LOWER(p.concentration) LIKE ?';
    params.push(`%${filter.concentration.toLowerCase()}%`);
  }

  if (filter.minPrice && filter.minPrice > 0) {
    sql += ' AND p.price >= ?';
    params.push(filter.minPrice);
  }

  if (filter.maxPrice && filter.maxPrice > 0) {
    sql += ' AND p.price <= ?';
    params.push(filter.maxPrice);
  }

  if (filter.search && filter.search.trim()) {
    const s = `%${filter.search.toLowerCase()}%`;
    sql += ' AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(p.subtitle) LIKE ?)';
    params.push(s, s, s);
  }

  switch (filter.sort) {
    case 'price_asc':
      sql += ' ORDER BY p.price ASC';
      break;
    case 'price_desc':
      sql += ' ORDER BY p.price DESC';
      break;
    case 'rating':
      sql += ' ORDER BY p.rating DESC';
      break;
    case 'new':
      sql += ' ORDER BY p.is_new DESC, p.created_at DESC';
      break;
    default:
      sql += ' ORDER BY p.is_best_seller DESC, p.id ASC';
  }

  const [pRows] = await db.query<RowDataPacket[]>(sql, params);
  const products = pRows.map(mapProduct);

  if (products.length === 0) return [];

  const [notes] = await db.query<RowDataPacket[]>('SELECT * FROM fragrance_notes');
  const [variants] = await db.query<RowDataPacket[]>('SELECT * FROM product_variants');

  const notesByProdId = new Map<number, FragranceNote[]>();
  for (const n of notes) {
    const list = notesByProdId.get(n.product_id) || [];
    list.push(mapFragranceNote(n));
    notesByProdId.set(n.product_id, list);
  }

  const variantsByProdId = new Map<number, ProductVariant[]>();
  for (const v of variants) {
    const list = variantsByProdId.get(v.product_id) || [];
    list.push(mapVariant(v));
    variantsByProdId.set(v.product_id, list);
  }

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const row = pRows[i];
    if (row.collection_name) {
      p.collection = {
        id: p.collectionId,
        name: row.collection_name,
        slug: row.collection_slug,
        subtitle: '',
        description: '',
        imageUrl: '',
        featured: false,
        sortOrder: 0,
      };
    }
    p.notes = notesByProdId.get(p.id) || [];
    p.variants = variantsByProdId.get(p.id) || [];
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getPool();
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT p.*, c.name as collection_name, c.slug as collection_slug FROM products p LEFT JOIN collections c ON p.collection_id = c.id WHERE p.slug = ? LIMIT 1',
    [slug]
  );
  if (!rows || rows.length === 0) return null;

  const product = mapProduct(rows[0]);
  if (rows[0].collection_name) {
    product.collection = {
      id: product.collectionId,
      name: rows[0].collection_name,
      slug: rows[0].collection_slug,
      subtitle: '',
      description: '',
      imageUrl: '',
      featured: false,
      sortOrder: 0,
    };
  }

  const [notes] = await db.query<RowDataPacket[]>('SELECT * FROM fragrance_notes WHERE product_id = ?', [product.id]);
  const [variants] = await db.query<RowDataPacket[]>('SELECT * FROM product_variants WHERE product_id = ?', [product.id]);
  const [reviews] = await db.query<RowDataPacket[]>('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [product.id]);

  product.notes = notes.map(mapFragranceNote);
  product.variants = variants.map(mapVariant);
  product.reviews = reviews.map(mapReview);

  return product;
}

export async function getProductById(id: number): Promise<Product | null> {
  const db = getPool();
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT p.*, c.name as collection_name, c.slug as collection_slug FROM products p LEFT JOIN collections c ON p.collection_id = c.id WHERE p.id = ? LIMIT 1',
    [id]
  );
  if (!rows || rows.length === 0) return null;

  const product = mapProduct(rows[0]);
  if (rows[0].collection_name) {
    product.collection = {
      id: product.collectionId,
      name: rows[0].collection_name,
      slug: rows[0].collection_slug,
      subtitle: '',
      description: '',
      imageUrl: '',
      featured: false,
      sortOrder: 0,
    };
  }

  const [notes] = await db.query<RowDataPacket[]>('SELECT * FROM fragrance_notes WHERE product_id = ?', [product.id]);
  const [variants] = await db.query<RowDataPacket[]>('SELECT * FROM product_variants WHERE product_id = ?', [product.id]);
  const [reviews] = await db.query<RowDataPacket[]>('SELECT * FROM reviews WHERE product_id = ?', [product.id]);

  product.notes = notes.map(mapFragranceNote);
  product.variants = variants.map(mapVariant);
  product.reviews = reviews.map(mapReview);

  return product;
}

export async function createProduct(prod: any): Promise<Product> {
  const db = getPool();
  const now = new Date();

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO products (
      collection_id, name, slug, subtitle, description, concentration, scent_family,
      gender, sillage, longevity, price, compare_at_price, image_url, hover_image_url,
      rating, review_count, is_best_seller, is_new, in_stock, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      prod.collectionId || prod.collection_id || 1,
      prod.name,
      prod.slug,
      prod.subtitle || '',
      prod.description || '',
      prod.concentration || 'Pure Perfume Oil',
      prod.scentFamily || prod.scent_family || 'Oud',
      prod.gender || 'Unisex',
      prod.sillage || 'Strong',
      prod.longevity || '12+ Hours',
      prod.price || 0,
      prod.compareAtPrice || prod.compare_at_price || null,
      prod.imageUrl || prod.image_url || '',
      prod.hoverImageUrl || prod.hover_image_url || '',
      prod.rating || 5.0,
      prod.reviewCount || prod.review_count || 0,
      prod.isBestSeller || prod.is_best_seller ? 1 : 0,
      prod.isNew || prod.is_new ? 1 : 0,
      prod.inStock !== false && prod.in_stock !== false ? 1 : 0,
      now,
      now,
    ]
  );

  const productId = result.insertId;

  if (Array.isArray(prod.notes)) {
    for (const note of prod.notes) {
      await db.query(
        'INSERT INTO fragrance_notes (product_id, layer, note_name, description) VALUES (?, ?, ?, ?)',
        [productId, note.layer || 'top', note.noteName || note.note_name || '', note.description || '']
      );
    }
  }

  if (Array.isArray(prod.variants)) {
    for (const v of prod.variants) {
      await db.query(
        'INSERT INTO product_variants (product_id, size, price, in_stock) VALUES (?, ?, ?, ?)',
        [productId, v.size || '50ml', v.price || prod.price || 0, v.inStock !== false ? 1 : 0]
      );
    }
  }

  return (await getProductById(productId))!;
}

export async function updateProduct(id: number, updates: any): Promise<Product | null> {
  const db = getPool();
  const fields: string[] = [];
  const values: any[] = [];

  const map: Record<string, string> = {
    name: 'name',
    slug: 'slug',
    subtitle: 'subtitle',
    description: 'description',
    concentration: 'concentration',
    scentFamily: 'scent_family',
    scent_family: 'scent_family',
    gender: 'gender',
    sillage: 'sillage',
    longevity: 'longevity',
    price: 'price',
    compareAtPrice: 'compare_at_price',
    compare_at_price: 'compare_at_price',
    imageUrl: 'image_url',
    image_url: 'image_url',
    hoverImageUrl: 'hover_image_url',
    hover_image_url: 'hover_image_url',
    collectionId: 'collection_id',
    collection_id: 'collection_id',
    rating: 'rating',
    reviewCount: 'review_count',
    review_count: 'review_count',
    isBestSeller: 'is_best_seller',
    is_best_seller: 'is_best_seller',
    isNew: 'is_new',
    is_new: 'is_new',
    inStock: 'in_stock',
    in_stock: 'in_stock',
  };

  for (const [key, col] of Object.entries(map)) {
    if (updates[key] !== undefined) {
      fields.push(`${col} = ?`);
      let val = updates[key];
      if (typeof val === 'boolean') val = val ? 1 : 0;
      values.push(val);
    }
  }

  if (fields.length > 0) {
    fields.push('updated_at = ?');
    values.push(new Date());
    values.push(id);
    await db.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  if (Array.isArray(updates.notes)) {
    await db.query('DELETE FROM fragrance_notes WHERE product_id = ?', [id]);
    for (const note of updates.notes) {
      await db.query(
        'INSERT INTO fragrance_notes (product_id, layer, note_name, description) VALUES (?, ?, ?, ?)',
        [id, note.layer || 'top', note.noteName || note.note_name || '', note.description || '']
      );
    }
  }

  if (Array.isArray(updates.variants)) {
    await db.query('DELETE FROM product_variants WHERE product_id = ?', [id]);
    for (const v of updates.variants) {
      await db.query(
        'INSERT INTO product_variants (product_id, size, price, in_stock) VALUES (?, ?, ?, ?)',
        [id, v.size || '50ml', v.price || 0, v.inStock !== false ? 1 : 0]
      );
    }
  }

  return getProductById(id);
}

export async function deleteProduct(id: number): Promise<void> {
  const db = getPool();
  await db.query('DELETE FROM fragrance_notes WHERE product_id = ?', [id]);
  await db.query('DELETE FROM product_variants WHERE product_id = ?', [id]);
  await db.query('DELETE FROM reviews WHERE product_id = ?', [id]);
  await db.query('DELETE FROM products WHERE id = ?', [id]);
}

// ----------------- Blog Posts Operations -----------------

export async function getBlogPosts(): Promise<BlogPost[]> {
  const db = getPool();
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM blog_posts WHERE published = 1 ORDER BY sort_order ASC, created_at DESC'
  );
  return rows.map(mapBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = getPool();
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM blog_posts WHERE slug = ? AND published = 1 LIMIT 1',
    [slug]
  );
  if (!rows || rows.length === 0) return null;
  return mapBlogPost(rows[0]);
}

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const db = getPool();
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM blog_posts WHERE id = ? LIMIT 1', [id]);
  if (!rows || rows.length === 0) return null;
  return mapBlogPost(rows[0]);
}

export async function createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
  const db = getPool();
  const now = new Date();
  const [res] = await db.query<ResultSetHeader>(
    `INSERT INTO blog_posts (title, slug, excerpt, content, image_url, category, read_time, published, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      post.title,
      post.slug,
      post.excerpt || '',
      post.content || '',
      post.imageUrl || '',
      post.category || '',
      post.readTime || '',
      post.published !== false ? 1 : 0,
      post.sortOrder || 0,
      now,
      now,
    ]
  );
  return (await getBlogPostById(res.insertId))!;
}

export async function updateBlogPost(id: number, updates: any): Promise<BlogPost | null> {
  const db = getPool();
  const fields: string[] = [];
  const values: any[] = [];

  const map: Record<string, string> = {
    title: 'title',
    slug: 'slug',
    excerpt: 'excerpt',
    content: 'content',
    imageUrl: 'image_url',
    image_url: 'image_url',
    category: 'category',
    readTime: 'read_time',
    read_time: 'read_time',
    published: 'published',
    sortOrder: 'sort_order',
    sort_order: 'sort_order',
  };

  for (const [key, col] of Object.entries(map)) {
    if (updates[key] !== undefined) {
      fields.push(`${col} = ?`);
      let val = updates[key];
      if (typeof val === 'boolean') val = val ? 1 : 0;
      values.push(val);
    }
  }

  if (fields.length > 0) {
    fields.push('updated_at = ?');
    values.push(new Date());
    values.push(id);
    await db.query(`UPDATE blog_posts SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  return getBlogPostById(id);
}

export async function deleteBlogPost(id: number): Promise<void> {
  const db = getPool();
  await db.query('DELETE FROM blog_posts WHERE id = ?', [id]);
}

// ----------------- FAQ Operations -----------------

export async function getFaqs(all = false): Promise<FAQ[]> {
  const db = getPool();
  const query = all
    ? 'SELECT * FROM faqs ORDER BY sort_order ASC, id ASC'
    : 'SELECT * FROM faqs WHERE published = 1 ORDER BY sort_order ASC, id ASC';
  const [rows] = await db.query<RowDataPacket[]>(query);
  return rows.map(mapFAQ);
}

export async function getFaqById(id: number): Promise<FAQ | null> {
  const db = getPool();
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM faqs WHERE id = ? LIMIT 1', [id]);
  if (!rows || rows.length === 0) return null;
  return mapFAQ(rows[0]);
}

export async function createFaq(faq: Partial<FAQ>): Promise<FAQ> {
  const db = getPool();
  const now = new Date();
  const [res] = await db.query<ResultSetHeader>(
    `INSERT INTO faqs (category, question, answer, sort_order, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      faq.category || '',
      faq.question || '',
      faq.answer || '',
      faq.sortOrder || 0,
      faq.published !== false ? 1 : 0,
      now,
      now,
    ]
  );
  return (await getFaqById(res.insertId))!;
}

export async function updateFaq(id: number, updates: any): Promise<FAQ | null> {
  const db = getPool();
  const fields: string[] = [];
  const values: any[] = [];

  const map: Record<string, string> = {
    category: 'category',
    question: 'question',
    answer: 'answer',
    sortOrder: 'sort_order',
    sort_order: 'sort_order',
    published: 'published',
  };

  for (const [key, col] of Object.entries(map)) {
    if (updates[key] !== undefined) {
      fields.push(`${col} = ?`);
      let val = updates[key];
      if (typeof val === 'boolean') val = val ? 1 : 0;
      values.push(val);
    }
  }

  if (fields.length > 0) {
    fields.push('updated_at = ?');
    values.push(new Date());
    values.push(id);
    await db.query(`UPDATE faqs SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  return getFaqById(id);
}

export async function deleteFaq(id: number): Promise<void> {
  const db = getPool();
  await db.query('DELETE FROM faqs WHERE id = ?', [id]);
}

// ----------------- Orders Operations -----------------

export async function getOrders(): Promise<Order[]> {
  const db = getPool();
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM orders ORDER BY created_at DESC');
  const [itemRows] = await db.query<RowDataPacket[]>('SELECT * FROM order_items');

  const itemsByOrderId = new Map<number, OrderItem[]>();
  for (const item of itemRows) {
    const list = itemsByOrderId.get(item.order_id) || [];
    list.push(mapOrderItem(item));
    itemsByOrderId.set(item.order_id, list);
  }

  return rows.map((r) => {
    const order = mapOrder(r);
    order.items = itemsByOrderId.get(order.id) || [];
    return order;
  });
}

export async function getOrderByReference(reference: string): Promise<Order | null> {
  const db = getPool();
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM orders WHERE reference = ? LIMIT 1', [reference]);
  if (!rows || rows.length === 0) return null;

  const order = mapOrder(rows[0]);
  const [itemRows] = await db.query<RowDataPacket[]>('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
  order.items = itemRows.map(mapOrderItem);
  return order;
}

export async function createOrder(orderData: Partial<Order>, items: OrderItem[]): Promise<Order> {
  const db = getPool();
  const now = new Date();
  const [res] = await db.query<ResultSetHeader>(
    `INSERT INTO orders (
      reference, paystack_ref, customer_name, customer_email, customer_phone,
      shipping_street, shipping_city, shipping_state, shipping_zip, shipping_country,
      total_amount, currency, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      orderData.reference,
      orderData.paystackRef || '',
      orderData.customerName || '',
      orderData.customerEmail || '',
      orderData.customerPhone || '',
      orderData.shippingStreet || '',
      orderData.shippingCity || '',
      orderData.shippingState || '',
      orderData.shippingZip || '',
      orderData.shippingCountry || 'Ghana',
      orderData.totalAmount || 0,
      orderData.currency || 'GHS',
      orderData.status || 'pending',
      now,
      now,
    ]
  );

  const orderId = res.insertId;

  for (const item of items) {
    await db.query(
      `INSERT INTO order_items (order_id, product_id, product_name, variant_size, quantity, unit_price, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, item.productId, item.productName, item.variantSize, item.quantity, item.unitPrice, item.imageUrl || '']
    );
  }

  return (await getOrderByReference(orderData.reference!))!;
}

export async function updateOrderStatus(reference: string, status: string, paystackRef?: string): Promise<void> {
  const db = getPool();
  const fields = ['status = ?', 'updated_at = ?'];
  const values: any[] = [status, new Date()];

  if (paystackRef) {
    fields.push('paystack_ref = ?');
    values.push(paystackRef);
  }

  values.push(reference);
  await db.query(`UPDATE orders SET ${fields.join(', ')} WHERE reference = ?`, values);
}

// ----------------- Admin Portal & Stats Operations -----------------

export async function getAdminStats() {
  const db = getPool();
  const [prods] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM products');
  const [cols] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM collections');
  const [orders] = await db.query<RowDataPacket[]>('SELECT * FROM orders');

  let totalRevenue = 0;
  let paidOrdersCount = 0;

  for (const o of orders) {
    if (o.status === 'paid' || o.status === 'successful') {
      totalRevenue += Number(o.total_amount) || 0;
      paidOrdersCount++;
    }
  }

  return {
    products_count: Number(prods[0].count) || 0,
    collections_count: Number(cols[0].count) || 0,
    orders_count: orders.length,
    paid_orders_count: paidOrdersCount,
    total_revenue: totalRevenue,
  };
}

export function checkAdminAuth(authHeader: string | null | undefined, queryToken?: string | null): boolean {
  const token = authHeader || queryToken;
  if (!token) return false;
  const clean = token.replace(/^Bearer\s+/i, '').trim();
  return clean.length >= 10 && clean.startsWith('azanduna_admin_token_');
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || 'RabbiAzanduna2026!';
  return password === expected;
}
