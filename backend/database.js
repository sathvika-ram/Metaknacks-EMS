const { Pool } = require('pg');

function createPool(options = {}) {
    const connectionString = String(process.env.DATABASE_URL || '').trim();
    if (!connectionString) throw new Error('DATABASE_URL must be configured.');

    const databaseUrl = new URL(connectionString);
    const isSupabase = databaseUrl.hostname.includes('supabase.co') || databaseUrl.hostname.includes('supabase.com');
    if (isSupabase && databaseUrl.port === '6543') databaseUrl.searchParams.set('pgbouncer', 'true');
    if (isSupabase && process.env.NODE_ENV === 'production' && databaseUrl.port !== '6543') {
        throw new Error('Production Supabase DATABASE_URL must use the pooled connection on port 6543 with pgbouncer=true.');
    }

    const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(databaseUrl.hostname);
    return new Pool({
        connectionString: databaseUrl.toString(),
        ssl: isLocal ? false : { rejectUnauthorized: false },
        ...options
    });
}

module.exports = { createPool };