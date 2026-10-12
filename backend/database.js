const { Pool } = require('pg');

function createPool(options = {}) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL must be configured.');
    const databaseHost = new URL(connectionString).hostname;
    const requiresSsl = process.env.NODE_ENV === 'production'
        || databaseHost.endsWith('.supabase.co')
        || databaseHost.endsWith('.pooler.supabase.com');

    return new Pool({
        connectionString,
        ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
        ...options
    });
}

module.exports = { createPool };