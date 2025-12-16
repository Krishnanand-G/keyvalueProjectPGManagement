import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// Create postgres connection
const client = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(client);
