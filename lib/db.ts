import { Pool } from 'pg';

import { env } from '@/lib/env';

let pool: Pool;

// Connection check is now handled by env.ts validation

const connectionString = env.DATABASE_URL;

// Singleton pattern for the database pool to prevent exhaustng connections
// in a serverless/Next.js environment during development hot-reloads.
if (env.NODE_ENV === 'production') {
    pool = new Pool({
        connectionString,
        max: 10, // Adjust based on your Supabase connection limits
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    // @ts-ignore - attaching to global for hot-reload persistence
    if (!global.dbPool) {
        // @ts-ignore
        global.dbPool = new Pool({
            connectionString,
            max: 5,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }
    // @ts-ignore
    pool = global.dbPool;
}

// Helper function to execute raw SQL queries
import { QueryResult, QueryResultRow } from 'pg';

export async function query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
        const res = await pool.query<T>(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Error executing query', { text, error });
        throw error;
    }
}

export default pool;
