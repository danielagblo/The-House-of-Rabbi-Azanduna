import 'dotenv/config';
import mysql from 'mysql2/promise';
import { TABLE_SCHEMAS } from './setup-db.mjs';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        options[key] = next;
        i++;
      } else {
        options[key] = true;
      }
    }
  }
  return options;
}

export async function migrateDatabase(customConfig = {}) {
  const cliArgs = parseArgs();

  // Source (Old) Database Configuration
  const sourceConfig = {
    host: customConfig.sourceHost || cliArgs['source-host'] || process.env.OLD_DB_HOST || 'sql12.freesqldatabase.com',
    user: customConfig.sourceUser || cliArgs['source-user'] || process.env.OLD_DB_USER || 'sql12837329',
    password: customConfig.sourcePassword || cliArgs['source-pass'] || process.env.OLD_DB_PASS || 'gzJ4lKcQaF',
    database: customConfig.sourceDatabase || cliArgs['source-db'] || process.env.OLD_DB_NAME || 'sql12837329',
    port: Number(customConfig.sourcePort || cliArgs['source-port'] || process.env.OLD_DB_PORT || 3306),
    connectTimeout: 15000,
    ssl: (cliArgs['source-ssl'] || process.env.OLD_DB_SSL) === 'true' ? { rejectUnauthorized: false } : undefined,
  };

  // Destination (New) Database Configuration
  const destConfig = {
    host: customConfig.destHost || cliArgs['dest-host'] || process.env.NEW_DB_HOST || process.env.DB_HOST,
    user: customConfig.destUser || cliArgs['dest-user'] || process.env.NEW_DB_USER || process.env.DB_USER,
    password: customConfig.destPassword || cliArgs['dest-pass'] || process.env.NEW_DB_PASS || process.env.DB_PASS,
    database: customConfig.destDatabase || cliArgs['dest-db'] || process.env.NEW_DB_NAME || process.env.DB_NAME,
    port: Number(customConfig.destPort || cliArgs['dest-port'] || process.env.NEW_DB_PORT || process.env.DB_PORT || 3306),
    connectTimeout: 15000,
    ssl: (cliArgs['dest-ssl'] || process.env.NEW_DB_SSL || process.env.DB_SSL) === 'true' ? { rejectUnauthorized: false } : undefined,
  };

  if (!destConfig.host || !destConfig.user || !destConfig.database) {
    console.error('\n❌ Missing destination database configuration!');
    console.log(`
Please provide the new database details either via CLI arguments or environment variables:

Usage:
  node scripts/migrate-db.mjs \\
    --dest-host <new_host> \\
    --dest-user <new_user> \\
    --dest-pass <new_password> \\
    --dest-db <new_database_name> \\
    --dest-port 3306

Or set in your .env:
  NEW_DB_HOST=...
  NEW_DB_USER=...
  NEW_DB_PASS=...
  NEW_DB_NAME=...
  NEW_DB_PORT=3306
`);
    process.exit(1);
  }

  console.log('\n======================================================');
  console.log('       RABBI AZANDUNA - DATABASE MIGRATION TOOL       ');
  console.log('======================================================');
  console.log(`[Source]      ${sourceConfig.user}@${sourceConfig.host}:${sourceConfig.port}/${sourceConfig.database}`);
  console.log(`[Destination] ${destConfig.user}@${destConfig.host}:${destConfig.port}/${destConfig.database}`);
  console.log('------------------------------------------------------\n');

  console.log('1. Connecting to Source and Destination databases...');
  const sourceConn = await mysql.createConnection(sourceConfig);
  console.log('   ✓ Connected to Source database');

  const destConn = await mysql.createConnection(destConfig);
  console.log('   ✓ Connected to Destination database');

  console.log('\n2. Ensuring tables exist in destination database...');
  for (const table of TABLE_SCHEMAS) {
    await destConn.query(table.sql);
  }
  console.log('   ✓ All schema tables ready');

  console.log('\n3. Migrating data across tables...');
  await destConn.query('SET FOREIGN_KEY_CHECKS = 0;');

  const tables = [
    'collections',
    'products',
    'product_variants',
    'fragrance_notes',
    'reviews',
    'orders',
    'order_items',
    'blog_posts',
    'faqs',
  ];

  const results = [];

  for (const tableName of tables) {
    process.stdout.write(`   - Migrating table \`${tableName}\`... `);

    // Fetch from source
    const [sourceRows] = await sourceConn.query(`SELECT * FROM \`${tableName}\``);
    const sourceCount = sourceRows.length;

    if (sourceCount === 0) {
      console.log('0 rows (empty, skipped)');
      results.push({ table: tableName, source: 0, dest: 0 });
      continue;
    }

    // Insert into destination
    for (const row of sourceRows) {
      const keys = Object.keys(row);
      const values = Object.values(row);
      const placeholders = keys.map(() => '?').join(', ');
      const escapedKeys = keys.map((k) => `\`${k}\``).join(', ');

      const updateClauses = keys
        .filter((k) => k !== 'id')
        .map((k) => `\`${k}\`=VALUES(\`${k}\`)`)
        .join(', ');

      const query = `
        INSERT INTO \`${tableName}\` (${escapedKeys})
        VALUES (${placeholders})
        ON DUPLICATE KEY UPDATE ${updateClauses || '`id`=`id`'}
      `;

      await destConn.execute(query, values);
    }

    // Check count in destination
    const [[{ destCount }]] = await destConn.query(`SELECT COUNT(*) as destCount FROM \`${tableName}\``);
    console.log(`✓ Copied ${sourceCount} rows (New total: ${destCount})`);
    results.push({ table: tableName, source: sourceCount, dest: destCount });
  }

  await destConn.query('SET FOREIGN_KEY_CHECKS = 1;');

  await sourceConn.end();
  await destConn.end();

  console.log('\n======================================================');
  console.log('               MIGRATION SUMMARY                      ');
  console.log('======================================================');
  console.table(results);
  console.log('✓ Migration completed successfully!\n');
}

// CLI Execution if run directly
if (process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/migrate-db.mjs')) {
  migrateDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('\n❌ Migration failed:', err.message);
      process.exit(1);
    });
}
