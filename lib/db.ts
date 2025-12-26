import { Pool } from 'pg';

let pool: Pool;

if (!process.env.DATABASE_URL) {
    // We can't initialize the pool without the URL, but we don't want to crash 
    // the build if it's missing during strict checks, so we handle it gracefully 
    // or expect it to be there at runtime.
    console.warn('DATABASE_URL is not defined in environment variables.');
}

const connectionString = process.env.DATABASE_URL;

// Singleton pattern for the database pool to prevent exhaustng connections
// in a serverless/Next.js environment during development hot-reloads.
if (process.env.NODE_ENV === 'production') {
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
export async function query(text: string, params?: any[]) {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Error executing query', { text, error });
        throw error;
    }
}

export default pool;
