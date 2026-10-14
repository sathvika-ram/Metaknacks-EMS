const { Pool } = require('pg');

function createPool(options = {}) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be configured.');
    const connectionUrl = new URL(process.env.DATABASE_URL);
    const databaseHost = connectionUrl.hostname;
    if (databaseHost.endsWith('.pooler.supabase.com') && connectionUrl.port === '5432') {
        connectionUrl.port = '6543';
    }
    const requiresSsl = process.env.NODE_ENV === 'production'
        || databaseHost.endsWith('.supabase.co')
        || databaseHost.endsWith('.pooler.supabase.com');

    return new Pool({
        connectionString: connectionUrl.toString(),
        ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
        ...options
    });
}

module.exports = { createPool };