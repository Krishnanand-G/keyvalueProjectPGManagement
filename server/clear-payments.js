import { db } from './src/config/db.js';
import { sql } from 'drizzle-orm';

const currentMonth = new Date().toISOString().slice(0, 7);

console.log(`Deleting all payments for month: ${currentMonth}`);

await db.execute(sql`DELETE FROM payments WHERE month = ${currentMonth}`);

console.log('✅ All current month payments deleted - all tenants now show as unpaid');
process.exit(0);
