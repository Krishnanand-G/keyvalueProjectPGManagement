import bcrypt from 'bcrypt';
import { db } from '../config/db.js';
import { users, rooms } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
    try {
        console.log('🌱 Seeding database...');

        // Check if hardcoded landlord exists
        const landlordUsername = 'landlord@pg.in';
        const existingLandlord = await db.select().from(users).where(eq(users.username, landlordUsername));

        if (existingLandlord.length === 0) {
            // Create hardcoded landlord
            const passwordHash = await bcrypt.hash('landlord123', 10);

            await db.insert(users).values({
                username: landlordUsername,
                passwordHash,
                role: 'landlord',
                name: 'Default Landlord',
                age: null,
                phone: null,
            });

            console.log('✅ Hardcoded landlord created: landlord@pg.in / landlord123');
        } else {
            console.log('✅ Hardcoded landlord already exists');
        }

        // Check if default room exists
        const existingRooms = await db.select().from(rooms);

        if (existingRooms.length === 0) {
            // Create one default room
            await db.insert(rooms).values({
                roomNumber: 101,
                maxTenants: 2,
                rentPerTenant: 5000,
            });

            console.log('✅ Default room created: Room 101 (Max 2 tenants, ₹5000/tenant)');
        } else {
            console.log(`✅ ${existingRooms.length} room(s) already exist in database`);
        }

        console.log('🌱 Database seeding complete');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }
}
