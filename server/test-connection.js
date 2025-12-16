import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// Properly URL-encoded password: XQwQ!aGr%!X7u!x becomes XQwQ%21aGr%25%21X7u%21x
const connectionString = 'postgresql://postgres:XQwQ%21aGr%25%21X7u%21x@db.hednuhhpsbfexvyzoqlk.supabase.co:5432/postgres';

console.log('Testing connection to Supabase...');

async function testConnection() {
    try {
        const sql = postgres(connectionString);
        const result = await sql`SELECT NOW() as current_time`;
        console.log('✅ Connection successful!');
        console.log('Current database time:', result[0].current_time);
        await sql.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
