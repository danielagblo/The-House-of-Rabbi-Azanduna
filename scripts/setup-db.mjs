import 'dotenv/config';
import mysql from 'mysql2/promise';

/**
 * Schema definitions for Rabbi Azanduna Luxury Oud database.
 * Uses utf8mb4 charset and InnoDB engine.
 */
export const TABLE_SCHEMAS = [
  {
    name: 'collections',
    sql: `
      CREATE TABLE IF NOT EXISTS \`collections\` (
        \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`slug\` varchar(255) NOT NULL,
        \`subtitle\` varchar(255) DEFAULT NULL,
        \`description\` text,
        \`image_url\` longtext,
        \`badge\` varchar(100) DEFAULT NULL,
        \`featured\` tinyint(1) DEFAULT '0',
        \`sort_order\` bigint(20) DEFAULT '0',
        \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`idx_collections_slug\` (\`slug\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
  {
    name: 'products',
    sql: `
      CREATE TABLE IF NOT EXISTS \`products\` (
        \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        \`collection_id\` bigint(20) unsigned DEFAULT NULL,
        \`name\` varchar(255) NOT NULL,
        \`slug\` varchar(255) NOT NULL,
        \`subtitle\` varchar(255) DEFAULT NULL,
        \`description\` text,
        \`concentration\` varchar(100) NOT NULL,
        \`scent_family\` varchar(100) NOT NULL,
        \`gender\` varchar(50) DEFAULT 'Unisex',
        \`sillage\` varchar(100) DEFAULT 'Strong',
        \`longevity\` varchar(100) DEFAULT '12+ Hours',
        \`price\` decimal(10,2) NOT NULL,
        \`compare_at_price\` decimal(10,2) DEFAULT NULL,
        \`image_url\` longtext,
        \`hover_image_url\` longtext,
        \`rating\` decimal(3,2) DEFAULT '5.00',
        \`review_count\` bigint(20) DEFAULT '0',
        \`is_best_seller\` tinyint(1) DEFAULT '0',
        \`is_new\` tinyint(1) DEFAULT '0',
        \`in_stock\` tinyint(1) DEFAULT '1',
        \`stock_quantity\` int(11) NOT NULL DEFAULT '50',
        \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`idx_products_slug\` (\`slug\`),
        KEY \`idx_products_collection_id\` (\`collection_id\`),
        CONSTRAINT \`fk_collections_products\` FOREIGN KEY (\`collection_id\`) REFERENCES \`collections\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
  {
    name: 'product_variants',
    sql: `
      CREATE TABLE IF NOT EXISTS \`product_variants\` (
        \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        \`product_id\` bigint(20) unsigned NOT NULL,
        \`size\` varchar(50) NOT NULL,
        \`price\` decimal(10,2) NOT NULL,
        \`in_stock\` tinyint(1) DEFAULT '1',
        \`stock_quantity\` int(11) NOT NULL DEFAULT '50',
        PRIMARY KEY (\`id\`),
        KEY \`idx_product_variants_product_id\` (\`product_id\`),
        CONSTRAINT \`fk_products_variants\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
  {
    name: 'fragrance_notes',
    sql: `
      CREATE TABLE IF NOT EXISTS \`fragrance_notes\` (
        \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        \`product_id\` bigint(20) unsigned NOT NULL,
        \`layer\` varchar(50) NOT NULL,
        \`note_name\` varchar(100) NOT NULL,
        \`description\` varchar(255) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`idx_fragrance_notes_product_id\` (\`product_id\`),
        CONSTRAINT \`fk_products_notes\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
  {
    name: 'reviews',
    sql: `
      CREATE TABLE IF NOT EXISTS \`reviews\` (
        \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        \`product_id\` bigint(20) unsigned NOT NULL,
        \`author_name\` varchar(100) NOT NULL,
        \`rating\` bigint(20) NOT NULL,
        \`title\` varchar(255) DEFAULT NULL,
        \`comment\` text,
        \`verified_purchase\` tinyint(1) DEFAULT '1',
        \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_reviews_product_id\` (\`product_id\`),
        CONSTRAINT \`fk_products_reviews\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
  {
    name: 'orders',
    sql: `
      CREATE TABLE IF NOT EXISTS \`orders\` (
        \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        \`reference\` varchar(100) NOT NULL,
        \`paystack_ref\` varchar(100) DEFAULT NULL,
        \`customer_name\` varchar(255) NOT NULL,
        \`customer_email\` varchar(255) NOT NULL,
        \`customer_phone\` varchar(50) DEFAULT NULL,
        \`shipping_street\` varchar(255) DEFAULT NULL,
        \`shipping_city\` varchar(100) DEFAULT NULL,
        \`shipping_state\` varchar(100) DEFAULT NULL,
        \`shipping_zip\` varchar(50) DEFAULT NULL,
        \`shipping_country\` varchar(100) DEFAULT 'Ghana',
        \`total_amount\` decimal(10,2) NOT NULL,
        \`currency\` varchar(10) DEFAULT 'GHS',
        \`status\` varchar(50) DEFAULT 'pending',
        \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`idx_orders_reference\` (\`reference\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
  {
    name: 'order_items',
    sql: `
      CREATE TABLE IF NOT EXISTS \`order_items\` (
        \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        \`order_id\` bigint(20) unsigned NOT NULL,
        \`product_id\` bigint(20) unsigned NOT NULL,
        \`product_name\` varchar(255) NOT NULL,
        \`variant_size\` varchar(50) NOT NULL,
        \`quantity\` bigint(20) NOT NULL,
        \`unit_price\` decimal(10,2) NOT NULL,
        \`image_url\` longtext,
        PRIMARY KEY (\`id\`),
        KEY \`idx_order_items_order_id\` (\`order_id\`),
        CONSTRAINT \`fk_orders_items\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
  {
    name: 'blog_posts',
    sql: `
      CREATE TABLE IF NOT EXISTS \`blog_posts\` (
        \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL,
        \`slug\` varchar(255) NOT NULL,
        \`excerpt\` text,
        \`content\` text,
        \`image_url\` longtext,
        \`category\` varchar(100) DEFAULT NULL,
        \`read_time\` varchar(50) DEFAULT NULL,
        \`published\` tinyint(1) DEFAULT '1',
        \`sort_order\` bigint(20) DEFAULT '0',
        \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`idx_blog_posts_slug\` (\`slug\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
  {
    name: 'faqs',
    sql: `
      CREATE TABLE IF NOT EXISTS \`faqs\` (
        \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        \`category\` varchar(100) NOT NULL,
        \`question\` varchar(500) NOT NULL,
        \`answer\` text NOT NULL,
        \`sort_order\` bigint(20) DEFAULT '0',
        \`published\` tinyint(1) DEFAULT '1',
        \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
];

export async function setupDatabase(config) {
  const dbConfig = {
    host: config.host || process.env.DB_HOST,
    user: config.user || process.env.DB_USER,
    password: config.password || process.env.DB_PASS,
    database: config.database || process.env.DB_NAME,
    port: Number(config.port || process.env.DB_PORT || 3306),
    connectTimeout: 15000,
    ssl: config.ssl || (process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined),
  };

  console.log(`\nConnecting to MySQL server at ${dbConfig.host}:${dbConfig.port}...`);
  const conn = await mysql.createConnection(dbConfig);
  console.log(`Connected successfully to database "${dbConfig.database}"!`);

  console.log('\nCreating tables if they do not exist:');
  for (const table of TABLE_SCHEMAS) {
    process.stdout.write(`  - Creating table \`${table.name}\`... `);
    await conn.query(table.sql);
    console.log('✓ OK');
  }

  console.log('\nAll tables created successfully!\n');
  await conn.end();
}

// CLI Execution if run directly: node scripts/setup-db.mjs
if (process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/setup-db.mjs')) {
  setupDatabase({})
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('\nDatabase setup failed:', err.message);
      process.exit(1);
    });
}
