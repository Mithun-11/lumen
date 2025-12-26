import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

// Manually parse .env.local to get the connection string
let connectionString = process.env.DATABASE_URL;

if (!connectionString && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    // Match lines looking like DATABASE_URL=... or DATABASE_URL='...'
    const match = envContent.match(/^DATABASE_URL=(?:['"])(.+)(?:['"])$/m) || envContent.match(/^DATABASE_URL=(.+)$/m);
    if (match) {
        connectionString = match[1].trim();
    }
}

if (!connectionString) {
    console.error("Could not find DATABASE_URL in environment or .env.local");
    process.exit(1);
}

// Remove any wrapping quotes if they were captured (in case the regex was greedy/loose)
if (connectionString.startsWith("'") && connectionString.endsWith("'")) {
    connectionString = connectionString.slice(1, -1);
}
if (connectionString.startsWith('"') && connectionString.endsWith('"')) {
    connectionString = connectionString.slice(1, -1);
}

console.log("Connecting to database...");

const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        const client = await pool.connect();
        console.log("Connected successfully.");

        const schemaPath = path.resolve(__dirname, '../db/schema.sql');
        console.log(`Reading schema from ${schemaPath}`);
        const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

        console.log("Applying schema...");
        await client.query(schemaSql);
        console.log("Schema applied successfully!");

        client.release();
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
